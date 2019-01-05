<style lang="scss" scoped>
.drawer{
    background: #888;
    overflow-y: scroll;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    img{
        display: block;
        position: relative;
        z-index: 0;
        top: 0;
        left: 0;
        width: 95%;
        margin-bottom: 30px;
    }
    canvas{
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
    }
}
</style>

<template>
    <div class="drawer" :class="classes">

        <div v-if="imageStatus === 'loading'"
            class="text-center text-white p-5">
            Loading preview...
        </div>

        <img :src="url"
            class="mb-5">

        <canvas></canvas>

    </div>
</template>

<script>
    export default {
        
        data(){
            return {
                canvas: null,
                ctx: null,
                pixelRatio: 1,
                image: null,
                imageStatus: null,

                fieldId: null,
                selectedIds: [],

                draggingFieldId: null,
                dragFieldRect: null,
                dragMode: null,
                dragFromX: 0,
                dragFromY: 0,

                currentMouseX: 0,
                currentMouseY: 0,
                
                tmpPos: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 0
                },
            };
        },

        props: {

            url: {
                type: String,
                required: true,
            },

            fields: {
                type: Array,
                required: true,
            },

            fieldsHeight: {
                type: Number,
                required: false,
                default: 16
            },

            classes: {
                type: String,
                default: ''
            },

            precision: {
                type: Number,
                required: false,
                default: 4
            },

            colorValid: {
                type: String,
                required: false,
                default: 'LightSkyBlue'
            },

            colorInvalid: {
                type: String,
                required: false,
                default: 'Tomato'
            },

            colorCurrent: {
                type: String,
                required: false,
                default: 'DarkOrange'
            },

            colorSelected: {
                type: String,
                required: false,
                default: 'Gold'
            },

            fieldIsValid: {
                type: Function,
                required: false
            }
        },

        computed: {
            currentField(){
                return this.fieldWithId(this.fieldId);
            }
        },

        watch: {
            url: {
                handler(){
                    this.imageStatus = 'loading';
                }
            },
            fields: {
                handler(){
                    this.updateCanvas();
                }
            },
            fieldId: {
                handler(){
                    console.log('=> field ID changed', this.fieldId);
                    this.$emit('field-id-changed', this.fieldId);
                }
            },
            selectedIds: {
                handler(){
                    console.log('=> Selected IDs changed', this.selectedIds);
                    this.$emit('selected-ids-changed', this.selectedIds);
                }
            },
        },

        mounted() {
            
            let vm = this;

            // Init canvas and mouse callbacks
            this.initCanvas();

            // Each resize => resize image, canvas and repaint
            $(window).resize(function(){
                vm.resizeCanvas();
            });

            $(vm.$el).find('img').on('load', r => {
                vm.imageStatus = 'success';
                vm.fieldId = null;
                vm.selectedIds = [];
                $(vm.$el).scrollTop(0);
                vm.resizeCanvas();
            });

            $('html').on('keyup', function(e){

                //console.log(e, e.originalEvent, e.originalEvent.key);

                if(e.originalEvent.key === 'd' || e.originalEvent.key === 'D'){
                    vm.duplicateCurrentField();
                }else if(e.originalEvent.key === 'Delete'){
                    vm.deleteCurrentField();
                }/*else if(e.originalEvent.key === 'ArrowRight'){
                    vm.shiftField(1, 0);
                }else if(e.originalEvent.key === 'ArrowLeft'){
                    vm.shiftField(-1, 0);
                }else if(e.originalEvent.key === 'ArrowUp'){
                    vm.shiftField(0, -1);
                }else if(e.originalEvent.key === 'ArrowDown'){
                    vm.shiftField(0, 1);
                }*/
            });
        },

        updated(){
            this.resizeCanvas();
        },

        methods: {

            // ---------------------------------------------------------
            //  Get field from ID
            // ---------------------------------------------------------
            fieldWithId(fieldId){
                let field = null;
                for(let i=0; i<this.fields.length; ++i){
                    if(this.fields[i].id === fieldId){
                        field = this.fields[i];
                    }
                }
                return field;
            },

            fieldIdxFromId(fieldId){
                let idx = null;
                for(let i=0; i<this.fields.length; ++i){
                    if(this.fields[i].id === fieldId){
                        idx = i;
                    }
                }
                return idx;
            },

            fieldIdIsSelected(id){
                return (this.selectedIds.indexOf(id) !== -1);
            },

            // ---------------------------------------------------------
            //  Add a new field to the current page
            // ---------------------------------------------------------
            addField(field){
                this.fields.push(field);
                if(field.id){
                    this.fieldId = field.id;
                    this.selectedIds = [ field.id ];
                }
                this.updateCanvas();

                console.log('=> field-created');
                this.$emit('field-created', field);
            },

            // ---------------------------------------------------------
            //  Duplicate current field
            // ---------------------------------------------------------
            duplicateCurrentField(){

                if(this.currentField !== null){

                    var w = this.canvas[0].width;
                    var h = this.canvas[0].height;

                    this.addField({
                        // Geometry for the field
                        rect: {
                            x: (this.currentMouseX / w) - (this.currentField.rect.w / 2),
                            y: (this.currentMouseY / h) - (this.currentField.rect.h / 2),
                            w: this.currentField.rect.w,
                            h: this.currentField.rect.h,
                        },
                        // The key of the selected field (used to compute its value)
                        key: null,
                        // the type is the format to use when writing the field's value
                        type: this.currentField.type,
                        // The name of the field (for display purposes)
                        name: null,
                    });
                }
            },

            // ---------------------------------------------------------
            //  Delete current field
            // ---------------------------------------------------------
            deleteCurrentField(){
                let removeIdx = this.fieldIdxFromId(this.fieldId);
                let field = this.currentField;

                this.fieldId = null;
                this.selectedIds = [];
                this.fields.splice(removeIdx, 1);
                
                console.log('=> field-deleted');
                this.$emit('field-deleted', field);

                this.updateCanvas();
            },

            // ---------------------------------------------------------
            //  This function is used by "mousedown" callback
            //  to know if we just clicked on an existing field or not
            //  => returns the field id or null
            // ---------------------------------------------------------
            getFieldIdAt(x, y){

                var id = null;

                var w = this.canvas[0].width;
                var h = this.canvas[0].height;

                for(var i=0; i<this.fields.length; ++i){

                    var r = this.fields[i].rect;

                    if((x >= r.x * w) && (x <= (r.x + r.w) * w) && (y >= r.y * h) && (y <= (r.y + r.h) * h)) {
                        
                        id = this.fields[i].id;
                    }
                }
                return id;
            },

            // ---------------------------------------------------------
            //  Init canvas and mouse events callbacks
            // ---------------------------------------------------------
            initCanvas(){

                let vm = this;

                this.canvas = $(this.$el).find('canvas');
                this.ctx = this.canvas[0].getContext('2d');

                // Get the various pixel ratios
                let devicePixelRatio = window.devicePixelRatio || 1;
                let backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
                    this.ctx.mozBackingStorePixelRatio ||
                    this.ctx.msBackingStorePixelRatio ||
                    this.ctx.oBackingStorePixelRatio ||
                    this.ctx.backingStorePixelRatio || 1;

                // Store the pixel ratio for the current device resolution
                this.pixelRatio = devicePixelRatio / backingStoreRatio;

                this.ctx.scale(this.pixelRatio, this.pixelRatio);

                this.canvas.on('mousedown', function(e){

                    let x = e.originalEvent.layerX * vm.pixelRatio;
                    let y = e.originalEvent.layerY * vm.pixelRatio;
                    let tryingSelect = e.ctrlKey || e.metaKey;

                    vm.draggingFieldId = vm.getFieldIdAt(x, y);

                    // ------------------------------------------------
                    //  Click outside existing fields => draw a new one !
                    // ------------------------------------------------
                    if(vm.draggingFieldId === null && !vm.tmpPos.active && !tryingSelect){

                        // Reset selection
                        vm.fieldId = null;
                        vm.selectedIds = [];

                        vm.tmpPos.active = true;
                        vm.tmpPos.x1 = x;
                        vm.tmpPos.y1 = y;
                        vm.tmpPos.x2 = x + parseInt(vm.fieldsHeight * vm.pixelRatio);
                        vm.tmpPos.y2 = y + parseInt(vm.fieldsHeight * vm.pixelRatio);

                        vm.updateCanvas();
                    }

                    // ------------------------------------------------
                    //  Clicked an existing field
                    // ------------------------------------------------
                    if(vm.draggingFieldId !== null){

                        // Last field clicked must be the current one
                        vm.fieldId = vm.draggingFieldId;

                        // Not trying to select
                        if(!tryingSelect){

                            // Reset selection to the clicked field only
                            vm.selectedIds = [ vm.draggingFieldId ];

                            // Get the clicked field
                            var field = vm.fieldWithId(vm.draggingFieldId);

                            // dragMode may defer depending on which field's border has been clicked
                            vm.dragMode = vm.geometryModeForPos(x, y, field);

                            // The field can have been clicked anywhere inside itself,
                            // so we need to remember the exact click location
                            vm.dragFromX = x;
                            vm.dragFromY = y;

                            // Remember the initial field position as a reference,
                            // so we can resize and move it in all directions
                            vm.dragFieldRect = _.cloneDeep(field.rect);
                        
                        // Trying to select
                        }else{

                            // Toggle the field in the selection
                            let idx = vm.selectedIds.indexOf(vm.draggingFieldId);
                            if(idx === -1){
                                vm.selectedIds.push(vm.draggingFieldId);
                            }else{
                                vm.selectedIds.splice(idx, 1);
                                vm.fieldId = vm.selectedIds.length > 0 ? vm.selectedIds[vm.selectedIds.length - 1] : null;
                            }
                        }

                        vm.updateCanvas();
                    }

                }).on('mousemove', function(e){

                    let x = e.originalEvent.layerX * vm.pixelRatio;
                    let y = e.originalEvent.layerY * vm.pixelRatio;
                    let tryingSelect = e.ctrlKey || e.metaKey;

                    vm.currentMouseX = x;
                    vm.currentMouseY = y;

                    // ------------------------------------------------
                    //  Drawing a new field
                    // ------------------------------------------------
                    if(vm.tmpPos.active){
                        
                        vm.tmpPos.x2 = x;
                        if(parseInt(vm.fieldsHeight)){
                            vm.tmpPos.y2 = vm.tmpPos.y1 + parseInt(vm.fieldsHeight * vm.pixelRatio);
                        }else{
                            vm.tmpPos.y2 = y;
                        }
                        
                        vm.updateCanvas();
                    }

                    // ------------------------------------------------
                    //  Dragging an existing field
                    // ------------------------------------------------
                    if(vm.draggingFieldId !== null && !tryingSelect){

                        let field = vm.fieldWithId(vm.draggingFieldId);

                        let w = vm.canvas[0].width;
                        let h = vm.canvas[0].height;

                        if(vm.dragMode === 'move'){

                            field.rect.x = vm.dragFieldRect.x + (x - vm.dragFromX) / w;
                            field.rect.y = vm.dragFieldRect.y + (y - vm.dragFromY) / h;

                        }else if(vm.dragMode !== null){

                            let dx = (x - vm.dragFromX) / w;
                            let dy = (y - vm.dragFromY) / h;

                            if(vm.dragMode === 'resizeTopLeft'){

                                vm.resizeTop(vm.dragFieldRect, dy, field.rect);
                                vm.resizeLeft(vm.dragFieldRect, dx, field.rect);

                            }else if(vm.dragMode === 'resizeTopRight'){

                                vm.resizeTop(vm.dragFieldRect, dy, field.rect);
                                vm.resizeRight(vm.dragFieldRect, dx, field.rect);

                            }else if(vm.dragMode === 'resizeBotLeft'){

                                vm.resizeBot(vm.dragFieldRect, dy, field.rect);
                                vm.resizeLeft(vm.dragFieldRect, dx, field.rect);

                            }else if(vm.dragMode === 'resizeBotRight'){

                                vm.resizeBot(vm.dragFieldRect, dy, field.rect);
                                vm.resizeRight(vm.dragFieldRect, dx, field.rect);

                            }else if(vm.dragMode === 'resizeRight'){

                                vm.resizeRight(vm.dragFieldRect, dx, field.rect);

                            }else if(vm.dragMode === 'resizeBot'){

                                vm.resizeBot(vm.dragFieldRect, dy, field.rect);

                            }else if(vm.dragMode === 'resizeLeft'){

                                vm.resizeLeft(vm.dragFieldRect, dx, field.rect);

                            }else if(vm.dragMode === 'resizeTop'){

                                vm.resizeTop(vm.dragFieldRect, dy, field.rect);

                            }
                        }

                        //console.log('-> Dragging...', x - vm.dragFromX, y - vm.dragFromY);

                        vm.updateCanvas();
                    }

                }).on('mouseup', function(e){

                    if(vm.tmpPos.active){

                        let w = vm.canvas[0].width;
                        let h = vm.canvas[0].height;
                        
                        vm.tmpPos.active = false;

                        let factor = Math.pow(10, vm.precision);

                        var rect = {
                            x: Math.round(factor * Math.min(vm.tmpPos.x1, vm.tmpPos.x2) / w) / factor,
                            y: Math.round(factor * Math.min(vm.tmpPos.y1, vm.tmpPos.y2) / h) / factor,
                            w: Math.round(factor * Math.abs(vm.tmpPos.x1 - vm.tmpPos.x2) / w) / factor,
                            h: Math.round(factor * Math.abs(vm.tmpPos.y1 - vm.tmpPos.y2) / h) / factor,
                        };

                        // Il faut que la zone soit plus grande qu'un carré de 5px
                        if(rect.w * w >= 5 && rect.h * h >= 5){

                            vm.addField({
                                // Geometry for the field
                                rect: rect,
                                // The key of the selected field (used to compute its value)
                                key: null,
                                // the type is the format to use when writing the field's value
                                type: vm.defaultType,
                                // The name of the field (for display purposes)
                                name: null,
                            });
                        }
                    }

                    if(vm.draggingFieldId !== null){

                        let field = vm.fieldWithId(vm.draggingFieldId);
                        let factor = Math.pow(10, vm.precision);

                        let rect = {
                            x: Math.round(factor * field.rect.x) / factor,
                            y: Math.round(factor * field.rect.y) / factor,
                            w: Math.round(factor * field.rect.w) / factor,
                            h: Math.round(factor * field.rect.h) / factor,
                        };

                        field.rect = rect;

                        console.log('=> field-updated');
                        vm.$emit('field-updated', field);
                        vm.updateCanvas();

                        vm.draggingFieldId = null;
                        vm.dragFieldRect = null;
                        vm.dragMode = null;
                    }

                });
            },

            resizeCanvas(){

                console.log('== CANVAS RESIZE ==');

                var wrapper = $(this.$el);
                var image = $(this.$el).find('img');

                // Remove 25px in case of scroll bars showing
                // They are all smaller than 25px
                var w = Math.ceil(image.width());
                var h = Math.ceil(image.height());

                // upscale the canvas according to the current device resolution
                this.canvas[0].width = w * this.pixelRatio;
                this.canvas[0].height = h * this.pixelRatio;

                // Maintain the canvas display size
                this.canvas[0].style.width = w + 'px';
                this.canvas[0].style.height = h + 'px';

                console.log('-> Canvas real size', this.canvas[0].width, this.canvas[0].height);
                console.log('-> Canvas display size', this.canvas[0].style.width, this.canvas[0].style.height);
                console.log('-> Canvas pixel ratio', this.pixelRatio);

                // Scale the context to counter the fact that we've manually scaled our canvas element
                //this.ctx.scale(this.pixelRatio, this.pixelRatio);
                //this.ctx.setTransform(1, 0, 0, 1, 0, 0);

                this.updateCanvas();
            },

            updateCanvas(){

                console.log('== CANVAS REPAINT ==');
                console.log('-> Canvas real size', this.canvas[0].width, this.canvas[0].height);

                var w = this.canvas[0].width;
                var h = this.canvas[0].height;

                this.ctx.clearRect(0, 0, w, h);

                for(var i=0; i<this.fields.length; ++i){

                    var r = this.fields[i].rect;

                    this.ctx.save();
                    
                    let backColor = 'MediumAquamarine';
                    let lineWidth = 1;

                    if(this.fields[i].id === this.fieldId){
                        backColor = this.colorCurrent;
                        lineWidth = 4;
                    }else if(this.fieldIdIsSelected(this.fields[i].id)){
                        backColor = this.colorSelected;
                        lineWidth = 4;
                    }else if(this.fieldIsValid(this.fields[i])){
                        backColor = this.colorValid;
                    }else{
                        backColor = this.colorInvalid;
                    }
                    lineWidth *= this.pixelRatio;

                    this.ctx.fillStyle = backColor;
                    this.ctx.strokeStyle = 'black';
                    this.ctx.lineWidth = lineWidth;

                    this.ctx.beginPath();
                    this.ctx.rect(
                        Math.round(r.x * w), 
                        Math.round(r.y * h), 
                        Math.round(r.w * w), 
                        Math.round(r.h * h)
                    );
                    this.ctx.clip();
                    this.ctx.fill();
                    this.ctx.stroke();

                    this.ctx.font = '20px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillStyle = 'black';

                    let text = '';
                    if(!this.fieldIsValid(this.fields[i])){
                        text = '?';
                    }else if(this.fields[i].name){
                        text = this.fields[i].name;
                    }else{
                        text = '';
                    }
                    this.ctx.fillText(
                        text, 
                        Math.round((r.x * w) + lineWidth + ((r.w * w) - 2*lineWidth)/2), 
                        Math.round((r.y * h) + lineWidth + ((r.h * h) - 2*lineWidth)/2 + 8)
                    );

                    this.ctx.restore();
                }

                if(this.tmpPos.active){

                    this.ctx.save();

                    this.ctx.fillStyle = 'LightSkyBlue';
                    this.ctx.beginPath();
                    this.ctx.rect(
                        Math.round(Math.min(this.tmpPos.x1, this.tmpPos.x2)), 
                        Math.round(Math.min(this.tmpPos.y1, this.tmpPos.y2)), 
                        Math.round(Math.abs(this.tmpPos.x1 - this.tmpPos.x2)), 
                        Math.round(Math.abs(this.tmpPos.y1 - this.tmpPos.y2))
                    );
                    this.ctx.clip();
                    this.ctx.fill();

                    this.ctx.restore();
                }
            },

            geometryModeForPos(x, y, field){

                let w = this.canvas[0].width;
                let h = this.canvas[0].height;

                let rx = field.rect.x * w;
                let ry = field.rect.y * h;
                let rw = field.rect.w * w;
                let rh = field.rect.h * h;

                // Check the distance between the mouse and the field's borders
                let dTop = Math.abs(y - ry);
                let dBot = Math.abs((ry + rh) - y);
                let dLeft = Math.abs(x - rx);
                let dRight = Math.abs((rx + rw) - x);

                let threshold = 4;

                let geometryMode = 'move';

                if(dTop <= threshold && dLeft <= threshold) {geometryMode = 'resizeTopLeft';}
                else if(dTop <= threshold && dRight <= threshold) {geometryMode = 'resizeTopRight';}
                else if(dBot <= threshold && dLeft <= threshold) {geometryMode = 'resizeBotLeft';}
                else if(dBot <= threshold && dRight <= threshold) {geometryMode = 'resizeBotRight';}
                else if(dTop <= threshold) {geometryMode = 'resizeTop';}
                else if(dBot <= threshold) {geometryMode = 'resizeBot';}
                else if(dLeft <= threshold) {geometryMode = 'resizeLeft';}
                else if(dRight <= threshold) {geometryMode = 'resizeRight';}

                return geometryMode;
            },

            adjustToMinimum(dim, direction){

                let minimum = 10; // px minimum in all directions
                let full = (direction === 'width') ? this.canvas[0].width : this.canvas[0].height;
                let dimPixels = dim * full;
                dimPixels = Math.max(minimum, dimPixels);
                return dimPixels / full;
            },

            resizeRight(rectRef, dx, fieldRect){
                let fieldW = rectRef.w + dx;
                fieldW = this.adjustToMinimum(fieldW, 'width');
                fieldRect.w = fieldW;
            },

            resizeBot(rectRef, dy, fieldRect){
                let fieldH = rectRef.h + dy;
                fieldH = this.adjustToMinimum(fieldH, 'height');
                fieldRect.h = fieldH;
            },

            resizeLeft(rectRef, dx, fieldRect){
                let fieldX = rectRef.x + dx;
                let fieldW = rectRef.w - dx;
                
                fieldW = this.adjustToMinimum(fieldW, 'width');
                fieldX = rectRef.x + rectRef.w - fieldW;
                
                fieldRect.x = fieldX;
                fieldRect.w = fieldW;
            },

            resizeTop(rectRef, dy, fieldRect){
                let fieldY = rectRef.y + dy;
                let fieldH = rectRef.h - dy;
                
                fieldH = this.adjustToMinimum(fieldH, 'height');
                fieldY = rectRef.y + rectRef.h - fieldH;
                
                fieldRect.y = fieldY;
                fieldRect.h = fieldH;
            },

            /*shiftField(dx, dy){

                //console.log('-> Shifting', dx, dy);

                var mask = this.getMask(this.page);

                if(mask.fields && this.fieldIdx < mask.fields.length){

                    var w = this.canvas[0].width;
                    var h = this.canvas[0].height;

                    var currentField = mask.fields[this.fieldIdx];

                    currentField.rect.x += dx / w;
                    currentField.rect.y += dy / h;

                    //console.log('-> Shifted px', dx / w, dy / h);

                    this.save();
                    this.updateCanvas();
                }
            },*/

        }
    }
</script>

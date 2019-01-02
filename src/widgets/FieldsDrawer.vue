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
                image: null,
                imageStatus: null,

                fieldIdx: null,
                draggingFieldIdx: null,
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
            fieldIdx: {
                handler(){
                    console.log('=> field-index-changed', this.fieldIdx);
                    this.$emit('field-index-changed', this.fieldIdx);
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
                vm.fieldIdx = null;
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
            //  Add a new field to the current page
            // ---------------------------------------------------------
            addField(field){
                this.fields.push(field);
                this.fieldIdx = this.fields.length - 1;                
                this.updateCanvas();

                console.log('=> field-created');
                this.$emit('field-created', this.fields);
            },

            // ---------------------------------------------------------
            //  Duplicate current field
            // ---------------------------------------------------------
            duplicateCurrentField(){

                if(this.fieldIdx < this.fields.length){

                    let field = this.fields[this.fieldIdx];
                 
                    var w = this.canvas[0].width;
                    var h = this.canvas[0].height;

                    this.addField({
                        // Geometry for the field
                        rect: {
                            x: (this.currentMouseX / w) - (field.rect.w / 2),
                            y: (this.currentMouseY / h) - (field.rect.h / 2),
                            w: field.rect.w,
                            h: field.rect.h,
                        },
                        // The key of the selected field (used to compute its value)
                        key: null,
                        // the type is the format to use when writing the field's value
                        type: field.type,
                        // The name of the field (for display purposes)
                        name: null,
                        // Display conditions
                        conditions: [],
                    });
                }
            },

            // ---------------------------------------------------------
            //  Delete current field
            // ---------------------------------------------------------
            deleteCurrentField(){
                let removeIndex = this.fieldIdx;
                this.fieldIdx = (this.fieldIdx > 0) ? this.fieldIdx - 1 : null;
                this.fields.splice(removeIndex, 1);
                this.updateCanvas();
                console.log('=> field-deleted');
                this.$emit('field-deleted', this.fields);
            },

            /*
            

            // ---------------------------------------------------------
            //  Set current field
            // ---------------------------------------------------------
            setField(idx){
                this.fieldIdx = idx;
                this.updateCanvas();
            },

            */

            // ---------------------------------------------------------
            //  This function is used by "mousedown" callback
            //  to know if we just clicked on an existing field or not
            //  => returns the field index or null
            // ---------------------------------------------------------
            getFieldIdxAt(x, y){

                var idx = null;

                var w = this.canvas[0].width;
                var h = this.canvas[0].height;

                for(var i=0; i<this.fields.length; ++i){

                    var r = this.fields[i].rect;

                    if((x >= r.x * w) && (x <= (r.x + r.w) * w) && (y >= r.y * h) && (y <= (r.y + r.h) * h)) {
                        
                        idx = i;
                    }
                }
                return idx;
            },

            // ---------------------------------------------------------
            //  Init canvas and mouse events callbacks
            // ---------------------------------------------------------
            initCanvas(){

                let vm = this;

                this.canvas = $(this.$el).find('canvas');
                this.ctx = this.canvas[0].getContext('2d');

                this.canvas.on('mousedown', function(e){

                    let x = e.originalEvent.layerX;
                    let y = e.originalEvent.layerY;

                    vm.draggingFieldIdx = vm.getFieldIdxAt(x, y);

                    if(vm.draggingFieldIdx === null && !vm.tmpPos.active){

                        vm.tmpPos.active = true;
                        vm.tmpPos.x1 = x;
                        vm.tmpPos.y1 = y;
                        vm.tmpPos.x2 = x;
                        vm.tmpPos.y2 = y;

                        vm.updateCanvas();
                    }

                    if(vm.draggingFieldIdx !== null){

                        vm.fieldIdx = vm.draggingFieldIdx;

                        // Get the clicked field
                        var field = vm.fields[vm.draggingFieldIdx];

                        vm.dragMode = vm.geometryModeForPos(x, y, field);

                        // The field can have been clicked anywhere inside itself,
                        // so we need to remember the exact click location
                        vm.dragFromX = x;
                        vm.dragFromY = y;

                        // Remember the initial field position as a reference,
                        // so we can resize and move it in all directions
                        vm.dragFieldRect = _.cloneDeep(field.rect);

                        vm.updateCanvas();
                    }

                }).on('mousemove', function(e){

                    var x = e.originalEvent.layerX;
                    var y = e.originalEvent.layerY;

                    vm.currentMouseX = x;
                    vm.currentMouseY = y;

                    if(vm.tmpPos.active){
                        
                        vm.tmpPos.x2 = x;
                        if(parseInt(vm.fieldsHeight)){
                            vm.tmpPos.y2 = vm.tmpPos.y1 + parseInt(vm.fieldsHeight);
                        }else{
                            vm.tmpPos.y2 = y;
                        }
                        

                        vm.updateCanvas();
                    }

                    if(vm.draggingFieldIdx !== null){

                        var field = vm.fields[vm.draggingFieldIdx];

                        var w = vm.canvas[0].width;
                        var h = vm.canvas[0].height;

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

                        var w = vm.canvas[0].width;
                        var h = vm.canvas[0].height;

                        //var x = e.originalEvent.layerX;
                        //var y = e.originalEvent.layerY;
                        
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
                                // Display conditions
                                conditions: [],
                            });
                        }
                    }

                    if(vm.draggingFieldIdx !== null){

                        console.log('=> field-updated');
                        vm.$emit('field-updated', vm.fields);
                        vm.updateCanvas();

                        vm.draggingFieldIdx = null;
                        vm.dragFieldRect = null;
                        vm.dragMode = null;
                    }

                });
            },

            resizeCanvas(){

                var wrapper = $(this.$el);
                var image = $(this.$el).find('img');

                // Remove 25px in case of scroll bars showing
                // They are all smaller than 25px
                var w = Math.ceil(image.width());
                var h = Math.ceil(image.height());

                if(w !== this.canvas[0].width || h !== this.canvas[0].height){

                    this.canvas[0].width = w;
                    this.canvas[0].height = h;

                    this.updateCanvas();
                }
            },

            updateCanvas(){

                console.log('REPAINT');

                var w = this.canvas[0].width;
                var h = this.canvas[0].height;

                this.ctx.clearRect(0, 0, w, h);

                for(var i=0; i<this.fields.length; ++i){

                    var r = this.fields[i].rect;

                    this.ctx.save();
                    
                    let backColor = 'LightSkyBlue';
                    if(!this.fields[i].key){
                        backColor = 'Tomato';
                    }

                    this.ctx.fillStyle = backColor;
                    this.ctx.strokeStyle = 'black';
                    this.ctx.lineWidth = (this.fieldIdx === i) ? 4 : 1;

                    this.ctx.beginPath();
                    this.ctx.rect(r.x * w, r.y * h, r.w * w, r.h * h);
                    this.ctx.clip();
                    this.ctx.fill();
                    this.ctx.stroke();

                    this.ctx.font = '10px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillStyle = 'black';

                    let text = '';
                    if(!this.fields[i].key){
                        text = 'Not assigned';
                    }else if(this.fields[i].name){
                        text = this.fields[i].name;
                    }else{
                        text = ''; //this.fields[i].key;
                    }
                    this.ctx.fillText(text, r.x * w + (r.w * w)/2, r.y * h + (r.h * h)/2 + 3); 

                    this.ctx.restore();
                }

                if(this.tmpPos.active){

                    this.ctx.save();

                    this.ctx.fillStyle = 'LightSkyBlue';
                    this.ctx.beginPath();
                    this.ctx.rect(
                        Math.min(this.tmpPos.x1, this.tmpPos.x2), 
                        Math.min(this.tmpPos.y1, this.tmpPos.y2), 
                        Math.abs(this.tmpPos.x1 - this.tmpPos.x2), 
                        Math.abs(this.tmpPos.y1 - this.tmpPos.y2)
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

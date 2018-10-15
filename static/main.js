(function(){
    var template_text = 
    `<span class='vl'>
        <i>{{value}}</i>
        <span class='bg-bx'></span>
        <span class='bg-ani'></span>
    </span>`
    var colors = ['#f9b2c5','#d6bbf3','#cfd0f3','#cfeaf3','#cff3d9','#f3ddcf','#ef67f7','#cff3d9'];
    
//==============word对象定义===================
    var textCom = {
        init : function( data ){
            this.wordsArr = [];
            this.blocks  = data.blocks;
            this.curBlocks = this.blocks;

            var textArr = data.text.split(' '),
                html = "" , word;
            for(var i in textArr){
                word  = new wordCom({
                    text : textArr[i],
                    color : colors[i]
                }, this);
                this.addWord(word);
            }

            for(var i in this.curBlocks){
                this.mergeWord( this.curBlocks[i][0] , this.curBlocks[i][1] );
            }
        },
        //添加一个word
        addWord : function( wcom ){
            this.wordsArr.push( wcom );
            wcom.render( $("#keyword-panel") );
        },
        //合并
        mergeWord : function( from , to ){
            if( from === to ) return;
            //方向
            var orientation = from > to ? -1 : 1;
            var wordFrom =  this.wordsArr[from],
                wordTo = this.wordsArr[to],
                targCorlor = wordFrom.getCurColor(),
                f = from - orientation,
                t = to;
            var fn = function( f ){
                orientation < 0? f-- : f++;
                if(f == t)
                    this.wordsArr[f].setCurColor( targCorlor , orientation );
                else
                    this.wordsArr[f].setCurColor( targCorlor , orientation , fn , f ,this);
            }
            fn.call(this,f);
            // while( f != t ){
            //     orientation < 0? f-- : f++;
            //     this.wordsArr[f].setCurColor( targCorlor , orientation , function(){} );
            // }
        },
        //分割词汇
        cutWord : function( index ){

        }
    }
//==============text对象定义结束=================

//==============word类定义===================
    var wordCom = function( data , parent){
        this.$dom = null;
        this.$bg_bx = null;
        this.$bg_ani = null;

        this.parent  = parent;
        this.conf = {
            text  : data.text,
            oriColor : data.color ,
            curColor : data.color
        }
    };
    wordCom.prototype = {
        render : function( fatherDom ){
            var html = template_text.replace('{{value}}' , this.conf.text );
            fatherDom = fatherDom || $("#keyword-panel");
            html = $(html);
            this.setMyDom( html );
            this.$dom = html;
            this.setBackColor( this.conf.oriColor );
            $(fatherDom).append( html );
        },
        //变换背景,设置当前颜色
        setCurColor : function( color , ori , callback , fromI ,scope){
            var domW = this.$bg_ani.width();
            this.$bg_bx.css('background' , this.conf.curColor);
            this.$bg_ani.css({
                'left' : (-domW*ori) + 'px',
                'background' : color
            });
            $(this.$bg_ani).animate({
                left : 0
            },300*(domW/80) , function(){
                if(typeof callback == 'function' && typeof fromI != 'undefined')
                    callback.call(scope ? scope : this.parent , fromI);
            });
        },
        //+++++++GET SET s

        setBackColor:function( color ){
            this.$dom.find(".bg-bx").css('background' , color );
        },
        getCurColor : function(){
            return this.conf.curColor;
        },
        setMyDom : function( dom ){
            this.$dom = dom;
            this.$bg_bx = dom.find('.bg-bx');
            this.$bg_ani = dom.find('.bg-ani');
        }
    }
//===============word类定义结束===================
    
    
    
    var text_data = {
        text : "hazardous labour minimun age hazardous labour minimun age",
        blocks : [ [5,0] , [6,7] ]
    };
    
    window.onload = function(){
        textCom.init( text_data );
    }
})();

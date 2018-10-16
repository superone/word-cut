(function(){
    var template_text = 
    `<span class='vl-bx'>
        <span class='vl'>
            <i>{{value}}</i>
            <span class='bg-bx'></span>
            <span class='bg-ani'></span>
        </span>
        <div class='slider'>
            <div class='slider-bx'>
                <span class='sld-bar'></span>
            <div>
        </div>
    </span>`
    var colors = ['#c5e192','#f4c188','#cfa4ce','#aadef3','#fff099','#9ff8f4','#f8bbd0','#cff3d9'];
    
//==============word对象定义===================
    var textCom = {
        init : function( data ){
            this.wordsArr = window.wordcoms = [];
            this.blocks  = data.blocks;
            this.curBlocks = this.blocks;

            var textArr = data.text.split(' '),
                html = "" ,
                word,
                defBlocks;
            
            for(var i in textArr){
                var type = "node";
                if(i==0)
                    type = "first";
                if(i == textArr.length-1)
                    type = "last"
                word  = new wordCom({
                    text : textArr[i],
                    color : colors[i],
                    index : i , 
                    type : type
                }, this);
                this.addWord(word);
            }
            for(var i in this.wordsArr){
                this.wordsArr[i].resetTextLen();
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

            //此处需判断form 和 to 分别是否属于其他block
            //如果属于,则需要从之前block中做剪切处理
            
            var fn = function( f ){
                orientation < 0? f-- : f++;
                if(f == t)
                    this.wordsArr[f].setCurColor( targCorlor , orientation );
                else
                    this.wordsArr[f].setCurColor( targCorlor , orientation , fn , f ,this);
                //设置word状态
                this.wordsArr[f].setBlocks([from , to]);
            }
            fn.call(this,f);
        },
        updateWordStatus : function( block ){
            var orientation = from > to ? -1 : 1;
            var from = block[0],
                to = block[1],
                wordCom = this.wordsArr[from] ,
                comIndex;
            while( wordCom && comIndex>0 ){
                comIndex = wordCom.getIndex();
                if( from == comIndex  ){
                    if( orientation < 0 ){

                    }
                }
                wordCom = this.wordsArr[ orientation + comIndex ]
            }
        },
        getWordByIndex : function( index ){
            return this.wordsArr[ index ];
        },
        getLastNextWord : function( word , ori ){
            var index = parseInt( word.getIndex() );
            index += ori;
            return this.wordsArr[ index ];
        },
        // //检查block是否可以合并
        // checkBlock : function( block ){
        //     var re = true,
        //         form = block[0],
        //         to = block[1],
        //         orientation = from > to ? -1 : 1;
        //     if( from == to) return re;
        //     while( from != to){

        //     }
        // },
        //分割词汇
        cutWord : function( index ){

        }
    }
//==============text对象定义结束=================

//==============word类定义===================
    var wordCom = function( data  , parent){
        this.$dom = null;
        this.$bg_bx = null;
        this.$bg_ani = null;

        this.parent  = parent;
        this.conf = {
            index : data.index,
            //所属block
            blocks : [ data.index , data.index],
            text  : data.text,
            oriColor : data.color ,
            curColor : data.color , 
            status : 'initial' , 
            type : data.type,
            textLen : {
                leftLen : 0,
                rightLen : 0
            }
        }
    };
    wordCom.prototype = {
        render : function( fatherDom ){
            fatherDom = fatherDom || $("#keyword-panel");
            var html = template_text.replace('{{value}}' , this.conf.text );
            html = $(html);
            if( this.getType() == 'last')
                html.find('div.slider').remove();
            this.setMyDom( html );
            this.setBackColor( this.conf.oriColor );
            $(fatherDom).append( html );
            this.bindEvents();
        },
        //添加滑动事件
        bindEvents:function(){
            var me = this;
            this.$dom.find('.sld-bar').on("mousedown" , function( e ){
                if( me.$dom.find('.slider-bx').hasClass('hide'))
                    return;
                me.moveEvents.call( me , e );
            })
        },
        //事件处理
        moveEvents : function( e ){
            var me = this ,
                old_block = me.conf.blocks,
                dom = e.currentTarget || e.target ,
                disX = e.clientX - dom.offsetLeft,
                leftTotal = this.conf.textLen.leftLen , rightTotal = this.conf.textLen.rightLen;

            $(document).on('mousemove' , function( ev ){
                var left = ev.clientX - disX;
                if( left < 0 && Math.abs(left) > leftTotal ){
                    return;
                }else if(  left > 0 && Math.abs(left) > rightTotal  ){
                    return;
                }
                $(dom).css('left' , left +'px');

                var curWord = me.getWordComByLeft(left);
                if( me.checkInBlock(curWord , old_block) ){
                    curWord.cutCurBlock( old_block );
                }
                var shouldBlock = me.getShouldBlock( curWord , old_block);
                
            })
            $(document).on("mouseup", function(ev){
                // var curLeft = $(dom).css('left')
                //     t_len = 0 , lastword = t_word = start = me ,
                // curLeft = parseInt( curLeft.replace('px' , ''));
                // var fh = curLeft<0 ? -1 : 1;

                // if (fh>0) 
                //     start = t_word = t_word.parent.getLastNextWord( t_word , fh);
                // while(t_word){
                //     t_len += t_word.$dom.width();
                //     lastword = t_word;
                //     t_word = t_word.parent.getLastNextWord( t_word , fh);
                //     if( t_word && (t_len + t_word.$dom.width()) >=  Math.abs(curLeft) )
                //         break;
                // }
                // var block = [ parseInt(start.getIndex()) , parseInt( t_word ? t_word.getIndex() : lastword.getIndex() ) ];
                // console.log(block);
                // me.parent.mergeWord(block[0] , block[1]);

                $(dom).css({
                    left : '-2px'
                })

                $(document).unbind("mousemove");
				$(document).unbind("mouseup");
                dom.releaseCapture && dom.releaseCapture();
            });
            dom.setCapture && dom.setCapture();
        },

        //通过拖动距离，计算出当前游标所在节点
        getWordComByLeft : function( left ){
            var me = this;
            var meBlock = me.conf.blocks ,
                start = t_word = last = me, 
                curWord , t_len=0;
            var fh = left<0 ? -1 : 1;
            if( fh>0)
                start = t_word = last = me.parent.getLastNextWord( me , fh);
            //找出当前所到的word
            while(true){
                t_len += t_word.$dom.width();
                if( t_len >= Math.abs(left) || !t_word){
                    break;
                }else{
                    last = t_word;
                    t_word = t_word.parent.getLastNextWord( t_word , fh);
                }
            }
            var cur = t_word ? t_word : last;
            
            return cur;
        },
        //通过游标所在节点计算出目标block
        getShouldBlock : function( toWordCom , old_block){
            var startI = parseInt( this.getIndex() ),
                toI = parseInt( toWordCom.getIndex() );
            var old_color = this.parent.getWordByIndex( old_block[0] );
            old_color = old_color.conf.curColor;
        },
        checkInBlock : function( word , block ){
            var index = parseInt(word.getIndex()),
                max = block[0]>=block[1]? block[0] : block[1],
                min = block[0]<block[1]? block[0] : block[1];
            return (index >= min && index <= max);
        },

        cutCurBlock : function( old_block ){
            var block = old_block,
                ori = block[0]>=block[1] ? -1 : 1,
                max = block[0]>=block[1]? block[0] : block[1],
                min = block[0]<block[1]? block[0] : block[1];
            var index = parseInt(this.getIndex());
            
            console.log('cut ' + this.getIndex() + ' from block [' + block.toString() + ']');
        },

        //变换背景,设置当前颜色
        setCurColor : function( color , ori , callback , fromI ,scope){
            var domW = this.$bg_ani.width();
            this.$bg_bx.css('background' , this.conf.curColor);
            this.$bg_ani.css({
                'left' : (-domW*ori) + 'px',
                'background' : color
            }).animate({
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
        getIndex : function(){
            return this.conf.index == 0 || this.conf.index>0 ? this.conf.index : -1;
        },
        getType : function(){
            return this.conf.type;
        },
        setBlocks : function( block ){
            block = block || [this.conf.index, this.conf.index];
            if( this.conf.blocks[0]==block[0] && this.conf.blocks[1]==block[1] )
                return;
            var orientation = block[0] >= block[1] ? -1 : 1;
            var min = block[0] <=block[1] ? block[0] : block[1],
                max = block[0] > block[1] ? block[0] : block[1];

            this.conf.blocks = block;

            var index = this.getIndex();
            if( index > min && index < max ){
                this.setStatus('in-block');
            }else if( orientation < 0){
                if( block[0] == index)
                    this.setStatus('block-right')
                else if( block[1] === index )
                    this.setStatus('block-left')
            }else if(  orientation > 0 ){
                if( block[0] == index)
                    this.setStatus('block-left')
                else if( block[1] == index )
                    this.setStatus('block-right')
            }
        },
        resetTextLen : function(){
            var word = this , 
                leftTotal = 0,
                rightTotal = 0;
            
            while( word ){
                leftTotal += word.$dom.width();
                word = word.parent.getLastNextWord( word , -1);
            }
            word = this.parent.getLastNextWord( this , 1);
            while( word ){
                rightTotal += word.$dom.width();
                word = word.parent.getLastNextWord( word , 1);
            }

            this.conf.textLen.leftLen = leftTotal;
            this.conf.textLen.rightLen = rightTotal;
        },
        setMyDom : function( dom ){
            this.$dom = dom;
            this.$bg_bx = dom.find('.bg-bx');
            this.$bg_ani = dom.find('.bg-ani');

        },
        setStatus : function( status ){
            this.conf.status = status;
            //如果在block中间
            if( status === 'in-block'){
                this.$dom.find('.slider-bx').addClass('hide');
            }else if( status === 'initial'){
            //还原初始态
                this.$dom.find('.slider-bx').removeClass('addClass');
            }else if( status === 'block-left'){
                this.$dom.find('.slider-bx').addClass('hide');
            }else if( status === 'block-right'){
                this.$dom.find('.slider-bx').removeClass('addClass');
            }
        }

    }
//===============word类定义结束===================
    
    
    
    var text_data = {
        text : "hazardous labour minimun age hazardous labour minimun age",
        blocks : [ [0,0] ,[1,2], [4,7] ]
    };
    
    window.onload = function(){
        textCom.init( text_data );
    }
})();

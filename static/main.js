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
                <span class='sld-bar'><img src='static/cut.png'></img></span>
            <div>
        </div>
    </span>`
    var colors = ['#c5e192','#f4c188','#cfa4ce','#aadef3','#fff099','#9ff8f4','#f8bbd0','#cff3d9'];
    
    function getOtherColor( arr ){
        var num = Math.floor(Math.random()*10+1);
        while( !colors[num] || $.inArray( colors[num] , arr)>=0 ){
            num = Math.floor(Math.random()*10+1)
        }
        return colors[num];
    }
//==============word对象定义===================
    var textCom = {
        savedStatus : null,

        init : function( data ){
            this.clear();
            this.wordsArr = window.wordcoms = [];
            this.blocks  = data.blocks;
            this.curBlocks = this.blocks;

            var textArr = this.textArr = data.text.split(' '),
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
        //把targIndex合进merge_block,同时从cut_block中切除
        mergeAndCutBlockByIndex : function( targIndex , merge_block , cut_block){
            targIndex = parseInt(targIndex);
            var targWord = this.getWordByIndex(targIndex);
            var merblock =  merge_block,
                cutblock = cut_block,
                newMerge = [] , newCut = [];
                
            console.log( targIndex + '===>[' + merge_block.toString() + ']🖤'+targIndex + '<===[' + cut_block.toString() + ']');
            var mergColor = this.getWordByIndex(merge_block[0]).getCurColor();

            if( merblock[0]>merblock[1])
                merblock = [merblock[1] , merblock[0]];
            if( cutblock[0]>cutblock[1])
                cutblock = [cutblock[1] , cutblock[0]];
            
            if( targIndex < merblock[0] ){
                newMerge = [ targIndex , merblock[1]];
                targWord.setCurColor( mergColor , -1 );
            }else if( targIndex > merblock[1] ){
                newMerge = [ merblock[0] ,targIndex ];
                targWord.setCurColor( mergColor , 1 );
            }
            if( cutblock[0] == cutblock[1] ){
                newCut = [];
            }else if( targIndex == cutblock[0] ){
                newCut = [ cutblock[0]+1 , cutblock[1]  ];
            }else if( targIndex == cutblock[1] ){
                newCut = [ cutblock[0] , cutblock[1]-1 ];
            }
            console.log("🕳 merblock:["+merblock.toString()+"]");
            console.log("🕳 newMerge:["+newMerge.toString()+"]");
            console.log("🕳 cutblock:["+cutblock.toString()+"]");
            console.log("🕳 newCut:["+newCut.toString()+"]");

            for( var i= newMerge[0] ; i<=newMerge[1] ; i++){
                this.getWordByIndex(i).setBlocks(newMerge);
            }
            if(newCut.length>0)
                for( var i= newCut[0] ; i<=newCut[1] ; i++){
                    this.getWordByIndex(i).setBlocks(newCut);
                }

            //console.log( 'merge '+ targIndex +' in :[' +merge_block.toString()+ '];;' + 'cut '+targIndex+' from :[' + cut_block.toString()+ '];;')
        },
        //初始合并blocks
        mergeWord : function( from , to , color){
            //if( from === to ) return;
            //方向
            var orientation = from > to ? -1 : 1;
            var wordFrom =  this.wordsArr[from],
                wordTo = this.wordsArr[to],
                targCorlor = color || wordFrom.getCurColor(),
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
                this.wordsArr[f].setBlocks([from<=to?from:to , to>from?to:from]);
            }
            fn.call(this,f);
        },
        // updateWordStatus : function( block ){
        //     var orientation = from > to ? -1 : 1;
        //     var from = block[0],
        //         to = block[1],
        //         wordCom = this.wordsArr[from] ,
        //         comIndex;
        //     while( wordCom && comIndex>0 ){
        //         comIndex = wordCom.getIndex();
        //         if( from == comIndex  ){
        //             if( orientation < 0 ){

        //             }
        //         }
        //         wordCom = this.wordsArr[ orientation + comIndex ]
        //     }
        // },
        getWordByIndex : function( index ){
            return this.wordsArr[ index ];
        },

        getLastNextWord : function( word , ori ){
            var index = parseInt( word.getIndex() );
            index += ori;
            return this.wordsArr[ index ];
        },
        //保存当前现场
        saveWordsStatus : function(){
            for( var i in this.wordsArr){
                this.wordsArr[i].saveNodeStatus();
            }
        },
        releaseWordsStatus : function(){
            for( var i in this.wordsArr){
                this.wordsArr[i].releaseNodeStatus();
            }
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
        searchAgain : function(){
            var blocks = [] , t , texts="";
            for(var i in this.wordsArr){
                t = this.wordsArr[i].conf.blocks;
                if( this.inBlock( t , blocks) < 0 ){
                    blocks.push(t);
                }
            }
            for( var i in blocks){
                var str = "";
                for( var j=blocks[i][0]; j <= blocks[i][1] ; j++){
                    str += (str?" " :'' ) + this.textArr[j];
                }
                texts += '<li><em>'+(parseInt( i)+1)+':</em>' + str +"</li>" ;
            }
            
            $("#result-panel ul").html( texts );
        },
        inBlock : function( block , list ){
            var re = -1;
            for (var i in list){
                if( list[i][0] == block[0] && list[i][1] == block[1] ){
                    re = i;
                }
            }
            return re;
        },

        clear : function(){
            var old = this.wordsArr || [];
            for( var i in old){
                old[i].remove();
            }
            $("#result-panel ul").html( "" );

            this.wordsArr = window.wordcoms = [];
            this.blocks  = [];
            this.curBlocks = [];

            this.textArr = [];
        },
        cutWord : function( index ){

        },
        //清除临时数据
        clearWordComTempData : function( key ){
            for (var i in this.wordsArr){
                this.wordsArr[i].temp[key] = null;
            }
        },

        updateBlock:function( block ){
            if(block.length<=0) return;
            console.log( block.toString());
            for(var i=block[0]; i<=block[1];i++){
                this.wordsArr[i].setBlocks(block);
            }
        }
    }
//==============text对象定义结束=================

//==============word类定义===================
    var wordCom = function( data  , parent){
        this.$dom = null;
        this.$bg_bx = null;
        this.$bg_ani = null;

        this.parent  = parent;
        this.savedStatus = null;
        this.temp = {};
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
            this.$dom.find('.sld-bar').click(function(e){
                me.barClickEvent( e );
            });
            this.$dom.find('.sld-bar').on("mousedown" , function( e ){
                if( me.$dom.find('.slider-bx').hasClass('hide'))
                    return;
                me.$dom.find('.slider-bx').addClass('moved');
                me.moveEvents.call( me , e );
            })
        },
        barClickEvent : function( e ){
            if( this.conf.status != 'in-block' && this.conf.status != 'block-left') return;
            if(this.$dom.find('.slider-bx').hasClass('moved')){
                this.$dom.find('.slider-bx').removeClass('moved');
                return;
            }
            var cur_block = this.conf.blocks;
            var cur_index = parseInt( this.getIndex() );

            var left_color = this.conf.curColor;
            var t_node = this.parent.getWordByIndex( cur_block[1]) ;
            var r_r_color = t_node.parent.getLastNextWord( t_node , 1);
            r_r_color = r_r_color ? r_r_color.conf.curColor : false;

            var newColor = getOtherColor([left_color , r_r_color]),
                tnode;
            for(var i=cur_block[0] ; i<=cur_index; i++){
                tnode = this.parent.getWordByIndex(i);
                tnode.setBlocks([cur_block[0] , cur_index]);
            }
            
console.log( left_color +'||' +r_r_color + "==>" + newColor);
console.log( [ cur_index+1 , cur_block[1]].toString());
            this.parent.mergeWord( cur_index+1 , cur_block[1] , newColor);
            // for(var i=cur_index+1; i<=cur_block[1];i++){
            //     tnode = this.parent.getWordByIndex(i);
            //     tnode.setBlocks([cur_index+1 , cur_block[1]]);
            // }

        },
        //事件处理
        moveEvents : function( e ){
            // oriWord 记录上一次处理过的节点
            var oriWord = me = this ,
                old_block = me.conf.blocks,
                dom = e.currentTarget || e.target ,
                disX = e.clientX - dom.offsetLeft,
                leftTotal = this.conf.textLen.leftLen , rightTotal = this.conf.textLen.rightLen;
            me.parent.saveWordsStatus();
            me.$dom.find('.slider').addClass('moving');
            me.parent.clearWordComTempData('tmpleft');

            $(document).on('mousemove' , function( ev ){
                var left = ev.clientX - disX;
                if( left < 0 && Math.abs(left) > leftTotal ){
                    return;
                }else if(  left > 0 && Math.abs(left) > rightTotal  ){
                    return;
                }
                $(dom).css('left' , left +'px');
                if(Math.abs(left)<8) return;
                /*
                难点：
                如果用户首先往A方向拉 , 触发节点状态改变
                然后又往回拉，此时判断零界点应从另一方向计算距离
                */
                var curWord = me.getWordComByLeft(left);
                //console.log(curWord.getIndex());
               //console.log("curnode:" + curWord.getIndex());
               if(!curWord.temp.tmpleft){
                    curWord.temp.tmpleft = left;
               }

               var mergeNode, cutNode;
               var rangeBlock = [parseInt(oriWord.getIndex()) ,parseInt(curWord.getIndex())];
               var direction = rangeBlock[0]>=rangeBlock[1] ? -1: 1;
               var startNode = direction<0 ? oriWord : oriWord.parent.getLastNextWord(oriWord ,1);
               var tolength = 0;
               for( var i= parseInt(startNode.getIndex() ) ; 
                        direction<0 ?(i>parseInt(curWord.getIndex())):(i<parseInt(curWord.getIndex())) ; 
                        i+=direction )
               {
                   tolength += me.parent.getWordByIndex(i).$dom.width();
               }
               //console.log( [parseInt(startNode.getIndex()),parseInt(curWord.getIndex())].toString()+'tolength:'+tolength);
               //if((Math.abs(left) - tolength ) <= curWord.$dom.width()*.3) return;
               //判断当前节点应做如何处理
               if( curWord.temp.tmpleft < 0){
                   var sub = Math.abs(left) - Math.abs(curWord.temp.tmpleft);
                    if( sub < curWord.$dom.width()*.3){
                        if(curWord.temp.changed)
                            curWord.recoveryBlock();
                        return;
                    }
               }else{
                    var sub = Math.abs(left) - Math.abs(curWord.temp.tmpleft);
                    if( sub < curWord.$dom.width()*.3){
                        if(curWord.temp.changed)
                            curWord.recoveryBlock();
                        return;
                    }
               }

                if(  left < 0  ){
                    mergeNode = curWord.parent.getLastNextWord( curWord , 1) ;
                }else{
                    mergeNode = curWord.parent.getLastNextWord( curWord , -1) ;;
                }
                //var mergeNode = left < 0 ? oriWord.parent.getLastNextWord( oriWord , 1) : oriWord;
                //var cutNode = left > 0 ? oriWord.parent.getLastNextWord( oriWord , 1) : oriWord;
                var merge_block = mergeNode ? mergeNode.conf.blocks : [];
                var cut_block = curWord ?  curWord.conf.blocks : [];


                var targIndex = parseInt( curWord.getIndex() );
                console.log( targIndex + '<===[' + cut_block.toString() + ']');
                if( targIndex >= merge_block[0] && targIndex <=  merge_block[1] ) return;

                //console.log( targIndex + '===>[' + merge_block.toString() + '];;'+targIndex + '<===[' + cut_block.toString() + ']');
                //console.log( 'merge '+ targIndex +' into :[' +merge_block.toString()+ '];;' + 
                //             'cut '+targIndex+' from :[' + cut_block.toString()+ '];;')
                oriWord.parent.mergeAndCutBlockByIndex(
                    parseInt( curWord.getIndex() )
                    ,merge_block
                    ,cut_block
                );
                curWord.temp.changed = true;
                
            });

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

                $(dom).css({left : '-2px'});
                //释放节点状态
                me.parent.releaseWordsStatus();
                $(document).unbind("mousemove");
				$(document).unbind("mouseup");
                dom.releaseCapture && dom.releaseCapture();
                me.$dom.find('.slider').removeClass('moving');
                me.parent.clearWordComTempData('tmpleft');
                me.parent.clearWordComTempData('changed');
            });
            dom.setCapture && dom.setCapture();
        },
        //恢复节点之前状态
        recoveryBlock : function(){
            var curIndex = parseInt( this.getIndex() ),
                old_block = this.savedStatus.blocks ,
                oldColor = this.savedStatus.curColor;
            var newBlock = [old_block[0] , curIndex];  
            var nextcolor = this.parent.getLastNextWord( this , 1) ? this.parent.getLastNextWord( this , 1).conf.curColor:false ,
                lastcolor = this.parent.getLastNextWord( this , 1) ? this.parent.getLastNextWord( this , -1).conf.curColor:false ;
            var newColor = getOtherColor([nextcolor , lastcolor]);

            this.parent.mergeWord( curIndex , curIndex , newColor);
            this.temp.changed = false;

            var last_node = this.parent.getLastNextWord( this , -1);
            var last_block = last_node ? last_node.conf.blocks : [];

            if( last_block[1] == curIndex)
                this.parent.updateBlock([last_block[0] , curIndex-1])
            else if( last_block[0] == curIndex )
                this.parent.updateBlock([curIndex+1 , last_block[1]])

            var next_node = this.parent.getLastNextWord( this , 1);
            var next_block = next_node ? next_node.conf.blocks : [];

            if( next_block[1] == curIndex)
                this.parent.updateBlock([next_block[0] , curIndex-1])
            else if( next_block[0] == curIndex )
                this.parent.updateBlock([curIndex+1 , next_block[1]])
            // this.parent.mergeAndCutBlockByIndex(
            //     curIndex
            //     , [curIndex , curIndex]
            //     , this.conf.blocks
            // );

        },

        saveNodeStatus : function(){
            this.savedStatus = $.extend( true , {} , this.conf);
        },
        releaseNodeStatus : function(){
            this.savedStatus = null;
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
        // late
        getShouldBlock : function( toWordCom , old_block){
            var startI = parseInt( this.getIndex() ),
                toI = parseInt( toWordCom.getIndex() );
            var old_color = this.parent.getWordByIndex( old_block[0] );
            old_color = old_color.conf.curColor;
        },
        // late
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
            //console.log(500*(domW/80));
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
            this.conf.curColor = color;
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
            if( this.getIndex() == 0){
                console.log(block);
            }
            block = block || [this.conf.index, this.conf.index];
            block = [ parseInt(block[0]),parseInt(block[1]) ];
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
                if( block[0] == index &&  block[1] == index){
                    this.setStatus('block-left&block-right')
                }else if( block[0] == index)
                    this.setStatus('block-right')
                else if( block[1] === index )
                    this.setStatus('block-left')
            }else if(  orientation > 0 ){
                if( block[0] == index &&  block[1] == index){
                    this.setStatus('block-left&block-right')
                }if( block[0] == index)
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
                this.$dom.find('.slider-bx').removeClass('hide');
            }else if( status === 'block-left'){
                this.$dom.find('.slider-bx').addClass('hide');
            }else if( status === 'block-right'){
                this.$dom.find('.slider-bx').removeClass('hide');
            }else if( status == 'block-left&block-right'){
                this.$dom.find('.slider-bx').removeClass('hide');
            }
        },

        remove : function(){
            this.$dom.remove();
        }

    }
//===============word类定义结束===================
    
    
    
    var text_data = {
        text : "hazardous labour minimun age hazardous labour minimun age",
        blocks : [ [0,3] ,[4,5] ,[6,7]]
    };
    
    window.onload = function(){
        textCom.init( text_data );
        $('#search').click(function(){
           textCom.searchAgain();
        })
        $('#reset').click(function(){
            textCom.init( text_data );
        })
    }
})();

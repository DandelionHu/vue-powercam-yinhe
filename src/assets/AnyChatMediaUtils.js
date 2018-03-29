/**
 * Created by fanyongsheng on 2017/5/22.
 */
var AnyChatMediaUtils  =  (function(){
    var ANYCHAT_SDKCTRL_PPTHELPERINIT	=	90;	///< PPT播报环境初始化
    var ANYCHAT_SDKCTRL_PPTFILECTRL		=	91;	///< PPT文件控制
    var ANYCHAT_SDKCTRL_PPTFILEINFO		=	92;	///< PPT文件信息

    var BRPPT_FILETYPE_PPT = 0x01;		///< ppt文件
    var BRPPT_FILETYPE_VIDEO = 0x02;		///< 视频文件
    var BRPPT_FILETYPE_AUDIO = 0x03;		///< 音频文件
    var BRPPT_FILETYPE_COMMZIP = 0x04;		///< 普通zip文件

    var option = {};
    var fuc = {};
    var newMediaPlayerList = [];               // 判断fileid 是否已经存在实例

    /**
     * type : 1:ppt ; 2:mp4 ; 3:mp3;
     */

    /**
     * [ {
          fileid:'20170522',
          guid:'201452-56544656-defeafew',
          type:1,
          data:{

                }
           },

        {
         fileid:'20170522',
         guid:'201452-56544656-defeafew',
         type:2,
         data:{

         }
     }]
     * @mediaDataInfo {Array}
     */

    var mediaDataInfo = [];



    /**
     * {
     *  savePath:'d://video';保存路径
     *  downloadcallback:      ;下载完回调法方法
     *  playendcallback:       ;播放完成方法名
     * }
     * @param option_json_var
     */
    function init(option_json_var){
        option = option_json_var;
        //ppt 压缩包保存地址
        var json = {"savepath":option.savepath};
        BRAC_SDKControl(ANYCHAT_SDKCTRL_PPTHELPERINIT, JSON.stringify(json));
    }


    /**
     * 下载完成后回调 //压缩之后
     * "{
           "ctrlcode" : 0,
           "errorcode" : 0,
           "fileid" : "20170518"
     }
     "
     * @param lpEventJsonStr
     */
    function downLoadCallBack(lpEventJsonStr){
        /**
         * "{
               "details" : {
                  "audio_address" : "audio/1.mp3",
                  "pptlist" : [
                     {
                        "audio_end" : 5,
                        "audio_start" : 0,
                        "ppt_address" : "ppt/1.jpg"
                     },
                     {
                        "audio_end" : 24,
                        "audio_start" : 5,
                        "ppt_address" : "ppt/2.jpg"
                     },
                     {
                        "audio_end" : 83,
                        "audio_start" : 24,
                        "ppt_address" : "ppt/3.jpg"
                     },
                     {
                        "audio_end" : 90,
                        "audio_start" : 83,
                        "ppt_address" : "ppt/4.jpg"
                     },
                     {
                        "audio_end" : 100,
                        "audio_start" : 90,
                        "ppt_address" : "ppt/5.jpg"
                     }
                  ]
               },
               "errorcode" : 0,
               "fileid" : "20170518",
               "filepath" : "d:\\video\\temp\\ppt\\20170518\\"
            }
         "
         @json
         */


        var  lpEventJsonObj = JSON.parse(lpEventJsonStr);
        var obj = {};
        if(lpEventJsonObj.errorcode!=0){

            obj.dataInfo = {};
            obj.downloadResult = lpEventJsonObj;
            if(typeof(option.downloadcallback) == 'function'){
                option.downloadcallback(obj);
            }
            return;
        }
        var  json = get_ppt_info(lpEventJsonObj.fileid);


        obj.dataInfo = json;
        obj.downloadResult = lpEventJsonObj;
        var newJson = init_media_address(json);

        for(var i in mediaDataInfo){
            if(lpEventJsonObj.fileid == mediaDataInfo[i].fileid){
                mediaDataInfo[i].details = newJson.details ;
                mediaDataInfo[i].errorcode = newJson.errorcode ;
                mediaDataInfo[i].filepath = newJson.filepath ;
                break;
            }
        }
        if(typeof(option.downloadcallback) == 'function'){
            option.downloadcallback(obj);
        }
    }

    /**
     * 初始化媒体地址
     */
    function init_media_address(json){
        var filePath = json.filepath;
        var fileDetail = json.details;
        switch (fileDetail.file_type){
            case BRPPT_FILETYPE_PPT:
                var audio_address = filePath+fileDetail.audio_address;
                var pptList = [];
                var pptDetail_list = fileDetail.pptlist;
                for(var i in pptDetail_list){
                    var obj = {};
                    obj.ppt_address = filePath+pptDetail_list[i].ppt_address;
                    obj.audio_start = pptDetail_list[i].audio_start;
                    obj.audio_end = pptDetail_list[i].audio_end;
                    pptList.push(obj);
                }
                json.details.audio_address = audio_address;
                json.details.pptlist = pptList;
                break;
            case BRPPT_FILETYPE_VIDEO:
                //var video_address = filePath;
                //json.details.video_address = video_address;
                break;
            case BRPPT_FILETYPE_AUDIO:
                //var audio_address = filePath+fileDetail.audio_address;
                //json.details.audio_address = audio_address;
                break;
        }

        return json;
    }


    /**
     * 解压完成后获取ppt详细信息
     */
    function get_ppt_info(fileid){
        var json = {"infocode":BRPPT_FILEINFO_PPTDETAILS, "fileid":fileid};
        var result = BRAC_SDKControl(ANYCHAT_SDKCTRL_PPTFILEINFO, JSON.stringify(json));
        return JSON.parse(result);
    }


    /**
     * 开始下载ppt
     */

    function download(fileid,fileurl,filemd5,filetype){

        var json = {"ctrlcode":BRPPT_FILECTRL_DOWNLOAD, "fileid":fileid, "fileurl":fileurl, "filemd5":filemd5,"filetype":filetype};
        var res = JSON.parse(BRAC_SDKControl(ANYCHAT_SDKCTRL_PPTFILECTRL, JSON.stringify(json)));
        if(res.errorcode==0){
            var obj = {};
            obj.fileid = fileid;
            obj.type = filetype;
            mediaDataInfo.push(obj);
        }

        return res.errorcode;
    }

    /**
     * 获取ppt 下载进度
     * 返回 {"errorcode":0, "fileid":"xxxxxx", "filetotalsize":10000, "downloadsize":5000, "progress":20}
     */
    function queryDownLoadStatus(fileid){
        var json = {"infocode":BRPPT_FILEINFO_DOWNLOAD_STATUS, "fileid":fileid};
        var result = BRAC_SDKControl(ANYCHAT_SDKCTRL_PPTFILEINFO, JSON.stringify(json));
        return JSON.parse(result);
    }

    /**
     * 取消ppt 下载
     * */
    function cancelDownload(fileid){
        var json =  {"ctrlcode":BRPPT_FILECTRL_CANCEL, "fileid":fileid};
        return BRAC_SetSDKOption(BRAC_SO_CORESDK_PPTFILECTRL, JSON.stringify(json));
    }


    //构造函数 首字母大写方便区分函数
    /**
     * 媒体播放类
     * @param fileid :文件id ; viewid : 播放窗口dom元素的id
     * {
     *  fileid:'20170518',
     *  viewid:'pptpage',
     * }
     */
    function Player(param){

        var self = this;
        self.isPlay_once = false;               // 判断是否点击播放后的第一秒

        /**
         * 根据参数值获取相应的fileid
         */
        if(param.fileid){
            var isNew = get_is_newMedia(param.fileid);
            self.fileid = param.fileid;
        }else if(param.filepath){
            var currentObj = init_filepath(param.filepath);
            var isNew = get_is_newMedia(currentObj.fileid);
            self.fileid = currentObj.fileid;
        }

        if(isNew.guid){
            self.guid = isNew.guid;
        }else{
            self.guid = BRAC_NewGuid();
        }

        //self.mediaInfo =get_media_info( self.fileid);
        if(param.hasOwnProperty("mediaInfo")){
            self.mediaInfo = param.mediaInfo;
        }else{
            self.mediaInfo = get_media_info( self.fileid);
        }  

        if(param.hasOwnProperty("fileType")){
            self.mediaType = param.fileType;
        }else{
            self.mediaType = self.mediaInfo.type;
        }        
        
        //self.mediaType  = self.mediaInfo.type;                           //当前播放媒体类型

        self.viewid = param.viewid;
        self.$mediaView = document.getElementById(self.viewid);                              //当前播放窗口
        self.$pptpage = "";                                               //当前播放ppt图片路径
        self.currentPage = 1;                                             //当前页
        self.oldpage = 0;
        self.timer;                                                        //计时器
        self.option = param;
        self.streamindex = 0;                                              //流在第几个位置
        var pptallpage = 0;                                           // ppt总页码
        self.mediaDuration = 0;                                     // 当前媒体时长
        if(param.streamindex){
            self.streamindex = param.streamindex;
        }
        /**
         * 根据文件路径创建媒体对象信息
         * @param url
         */
        function init_filepath(url){
            var ext = url.substring(url.lastIndexOf('.') + 1, url.length);
            if(/mp4/i.test(ext) ){
               var filetype = BRPPT_FILETYPE_VIDEO;
            }else if(/mp3/i.test(ext) ){
               var  filetype = BRPPT_FILETYPE_AUDIO;
            }
            var obj = {};
            obj.fileid = BRAC_NewGuid();
            obj.type = filetype;
            obj.details = {} ;
            obj.errorcode = 0;
            obj.filepath = url ;
            mediaDataInfo.push(obj);
            return obj;
        }

        /**
         * 获取媒体对象详情
         * @param fileid
         */
        function get_media_info(fileid){
            var obj = {};
            for(var i in mediaDataInfo){
                if(fileid == mediaDataInfo[i].fileid){
                    obj = mediaDataInfo[i];
                    break;
                }
            }
            return obj;
        }


        /**
         *
         */
        function get_is_newMedia(fileid){
            var obj = {};
            for(var i in newMediaPlayerList){
                if(fileid == newMediaPlayerList[i].fileid){
                    obj = newMediaPlayerList[i];
                    break;
                }
            }
            return obj;
        }

        /**
         * 媒体初始化
         * @param url
         * @param type
         */
        function initMedia(url,type){
            var dwFlags;
            var strJson = '';
            // type 1 :ppt;2:mp4;3:mp3
            switch(type){
                case BRPPT_FILETYPE_PPT:
                    dwFlags = 1;
                    pptallpage = self.mediaInfo.details.pptlist.length;  // 获取PPT总页码
                    break;
                case BRPPT_FILETYPE_VIDEO:
                    dwFlags = 3;
                    strJson = '{"streamindex":'+self.streamindex+'}';
                    break;
                case BRPPT_FILETYPE_AUDIO:
                    dwFlags = 1;
                    break;
            }
            BRAC_StreamPlayInit(self.guid ,url, dwFlags, strJson);

            var obj = {};
            obj.fileid = self.fileid;
            obj.guid = self.guid;
            newMediaPlayerList.push(obj);
        }

        /**
         * 获取流媒体播放进度(第几秒)
         */
        function queryInfoMedia(currentguid) {
            var jsonInfo = JSON.parse(BRAC_StreamPlayGetInfo(currentguid, ANYCHAT_STREAMPLAY_INFO_JSONVALUE));
            return jsonInfo.playtime / 1000;
        }

        /**
         * 切换PPT 图片
         * @param page
         * @returns {boolean}
         */
        function switch_page(page){
            if(page == self.oldpage && self.isPlay_once == false) return false;
            var ppt_address =  self.mediaInfo.details.pptlist[page-1].ppt_address;
            video_images(ppt_address);
            self.$mediaView.innerHTML='<img src=""  style="width: 100%">';
            self.$pptpage = self.$mediaView.getElementsByTagName('img');
            self.$pptpage[0].src = BRAC_GetSDKOptionStringEx(BRAC_SO_LOCALPATH2URL,ppt_address,0);
            self.oldpage = page;
            if(typeof(self.option.turnpagecallback) == 'function'){
                var json = {};
                json.currentpage = page ;
                json.allpage = pptallpage;
                self.option.turnpagecallback(json);
            }
            self.isPlay_once = false;
        }

        /**
         * 录入图片
         * @param filename
         */
        function video_images(filename){
            var picjson = {streamindex:self.streamindex, filename:filename};
            BRAC_SetSDKOption(BRAC_SO_RECORD_INSERTIMAGE,JSON.stringify(picjson));
            var json = {};

            /**
             * 底层传输
             * @type {number}
             */
            json.userid =  -1;
            json.command="control_ppt_page";
            json.data  = {"page_num":self.currentPage};
            BRAC_SDKControl(95,JSON.stringify(json));
        }

        /**
         *自动切换PPT 图片
         */
        function swtich_play_page(){
            for(var k in self.mediaInfo.details.pptlist){
                var audio_end = self.mediaInfo.details.pptlist[k].audio_end;
                var audio_start = self.mediaInfo.details.pptlist[k].audio_start;
                var playtime = queryInfoMedia(self.guid);
                if(audio_start <= playtime && audio_end > playtime){
                    self.currentPage = k - 0 + 1;
                }
            }
            if(~~(self.mediaDuration- playtime )==0){
                if(typeof(self.option.playendcallback) == 'function'){
                    var json = {};
                    json.errorcode = 0;
                    json.fileid = self.fileid;
                    self.option.playendcallback(json);
                }
                self.stop(self.fileid);
            }
        }

        /**
         * 手动切换ppt页面
         */
        function switch_ppt_ex(){
            if(self.currentPage - 1 == 0){
                BRAC_StreamPlayControl(self.guid, ANYCHAT_STREAMPLAY_CTRL_STOP, 0, 0, '');
            }else{
                BRAC_StreamPlayControl(self.guid, ANYCHAT_STREAMPLAY_CTRL_SEEK, self.mediaInfo.details.pptlist[(self.currentPage-1)].audio_start, 0, '');
            }
        }


        if(!isNew.guid){
            if(self.mediaType == BRPPT_FILETYPE_PPT){
                initMedia(self.mediaInfo.details.audio_address,self.mediaType);
            }else if(self.mediaType == BRPPT_FILETYPE_VIDEO || self.mediaType == BRPPT_FILETYPE_AUDIO){
                initMedia(self.mediaInfo.filepath,self.mediaType);
            }
        }


        function videoTime(){
            if(self.timer) clearInterval(self.timer);
            self.timer = setInterval(function(){
                var playtime = queryInfoMedia(self.guid);
                if(~~(self.mediaDuration- playtime )==0){
                    if(typeof(self.option.playendcallback) == 'function'){
                        var json = {};
                        json.errorcode = 0;
                        json.fileid = self.fileid;
                        self.option.playendcallback(json);
                    }
                    self.stop(self.fileid);
                }
            },1000);
        }

        /**
         * 播放
         */
        self.play = function(){
            document.getElementById(self.viewid).innerHTML = '';
            BRAC_StreamPlayControl(self.guid, ANYCHAT_STREAMPLAY_CTRL_START, 0, 0, '');
            if(self.mediaType ==  BRPPT_FILETYPE_PPT){
                /**
                 * ppt 播放
                 */
                self.isPlay_once = true;
                switch_page(self.currentPage);
                if(self.timer){
                    clearInterval(self.timer);
                    self.timer = 1;
                }
                self.timer = setInterval(function(){
                    swtich_play_page();
                    switch_page(self.currentPage);
                },1000);
            }else if(self.mediaType ==  BRPPT_FILETYPE_VIDEO){
                /**
                 * mp4 播放
                 */
                videoTime();

                BRAC_StreamPlaySetVideoPos(self.guid,document.getElementById(self.viewid), "ANYCHAT_VIDEO_REMOTE_"+ self.streamindex);
                //self.timer = '';
            }else if(self.mediaType == BRPPT_FILETYPE_AUDIO){
                /**
                 * mp3 播放
                 */
                videoTime();
            }

        };

        /**
         * 获取PPT的页码
         */
        self.pptdetail = function(){
            var json = {};
            if(self.mediaType == BRPPT_FILETYPE_PPT){
                json.currentpage = self.currentPage ;
                json.allpage = pptallpage;
            }else{
                json.currentpage = 0 ;
                json.allpage = 0;
            }
            return json
        }

        /**
         * 暂停
         */
        self.pause = function(){
            if(self.timer){
                self.timer = clearInterval(self.timer);
            }
            BRAC_StreamPlayControl(self.guid, ANYCHAT_STREAMPLAY_CTRL_PAUSE, 0, 0, '');
        };

        /**
         * 停止
         */
        self.stop = function(){

            self.timer = clearInterval(self.timer);
            self.timer=null;

            BRAC_StreamPlayControl(self.guid,ANYCHAT_STREAMPLAY_CTRL_STOP, 0, 0, '');
        };

        /**
         * 拖动进度条
         */
        self.dragProcess = function(dragTime){
            if(self.timer){
                self.timer = clearInterval(self.timer);
            }
                BRAC_StreamPlayControl(self.guid, ANYCHAT_STREAMPLAY_CTRL_SEEK, dragTime, 0, '');
        };


        /**
         * 控制ppt翻页
         * @param is   true 上一页 false 下一页
         */
        self.PPTControl = function(is){
            if(is){
                if(self.currentPage>1) {
                    self.currentPage--;
                    switch_page(self.currentPage);
                    switch_ppt_ex();
                }else{
                    return false;
                }
            }else{
                var allpage =  self.mediaInfo.details.pptlist.length;
                if(self.currentPage<allpage){
                    self.currentPage++;
                    switch_page(self.currentPage);
                    self.pause();
                    switch_ppt_ex();
                }else{
                    return false;
                }

            }
            return true;
        };

        /**
         * ppt 翻下一页
         */
        self.nextFrame = function(){
            self.PPTControl(false);
        };


        /**
         * ppt 翻上一页
         */
        self.previousFrame = function(){
            self.PPTControl(true);
        };




        /**
         * 获取播放状态
         * @returns {{}}
         */
        self.getPlayStatus = function(){
            if(!self.guid) return {};
            var jsonInfo = JSON.parse(BRAC_StreamPlayGetInfo(self.guid, ANYCHAT_STREAMPLAY_INFO_JSONVALUE));
            self.mediaDuration = jsonInfo.audioduration /1000;
            return jsonInfo;
        };


        /**
         * 销毁播放guid
         */
        self.destroy = function(){
            for(var i in newMediaPlayerList){
                if(self.guid == newMediaPlayerList[i].guid){
                    newMediaPlayerList[i] = {};
                    break;
                }
            }
            return BRAC_StreamPlayDestroy(self.guid,0);
        }

        /**
         * 触发录入第一张
         */
        self.once_img = function(){
            if(self.mediaType == 1){
                var filename = self.mediaInfo.details.pptlist[self.currentPage-1].ppt_address;
                video_images(filename);
            }
        }


    }

    //工厂模式
    fuc.downloadinit = init; //初始化
    fuc.download = download;//开始下载ppt
    fuc.queryDownLoadStatus = queryDownLoadStatus;//获取ppt 下载进度
    fuc.downLoadCallBack = downLoadCallBack;//下载完成回调函数
    fuc.cancelDownload = cancelDownload; //取消下载
    fuc.Player = Player;  //播放器
    return fuc;
})();

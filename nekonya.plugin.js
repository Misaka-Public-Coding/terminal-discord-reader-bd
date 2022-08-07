/**
 * @name NekoNya
 * @version 0.1
 */

 let active = true;
 let configUsers = ["853521854554701856","564093651589005333"]
 let configMessages = ["хентай","хентая","hentai"]

 module.exports = class NekoNya{
    getName() {
        return 'NekoNya';
      }
      getVersion() {
        return '0.1';
      }
      getAuthor() {
        return 'nekonya';
      }
      getDescription() {
        return 'Noten nya.';
      }

    load() { }
    start() {
        this.showToast('NekoNYA NYA~~~', { type: 'success', timeout: 5000 })
        this.ChannelStore = ZeresPluginLibrary.WebpackModules.getByProps('getChannel', 'getDMFromUserId');
        this.UserStore = ZeresPluginLibrary.WebpackModules.getByProps('getCurrentUser', 'getUser');
        ZeresPluginLibrary.WebpackModules.find(e => e.dispatch && !e.getCurrentUser),
        'dispatch',
        (_, args, original) => this.onDispatchEvent(args, original)
        this.Patcher = XenoLib.createSmartPatcher({ before: (moduleToPatch, functionName, callback, options = {}) => ZeresPluginLibrary.Patcher.before(this.getName(), moduleToPatch, functionName, callback, options), instead: (moduleToPatch, functionName, callback, options = {}) => ZeresPluginLibrary.Patcher.instead(this.getName(), moduleToPatch, functionName, callback, options), after: (moduleToPatch, functionName, callback, options = {}) => ZeresPluginLibrary.Patcher.after(this.getName(), moduleToPatch, functionName, callback, options) });
        this.unpatches = [];
        this.unpatches.push(
            this.Patcher.instead(
              ZeresPluginLibrary.WebpackModules.find(e => e.dispatch && !e.getCurrentUser),
              'dispatch',
              (_, args, original) => this.onDispatchEvent(args, original)
            )
          );
      
    }

    onDispatchEvent(args, callDefault) {
        const dispatch = args[0];
        const user = this.UserStore.getCurrentUser();
        if (active && dispatch.type == 'MESSAGE_CREATE' && dispatch.message.author.id !=user.id && dispatch.message){
            configUsers.forEach(u=>{
                if(dispatch.message.author.id==u){
                    this.postMessageFromUser(dispatch.message.content,dispatch.message.author.username,this.ChannelStore.getChannel(dispatch.message.channel_id).name,dispatch.message.channel_id.toString(), dispatch.message.id.toString(), this.ChannelStore.getChannel(dispatch.message.channel_id).guild_id)
                }
            })
            configMessages.forEach(t=>{
                if(dispatch.message.content.toLowerCase().includes(t)){
                    console.log('text trigger')
                    this.postMessageFromText(t,dispatch.message.author.username,this.ChannelStore.getChannel(dispatch.message.channel_id).name,dispatch.message.channel_id.toString(), dispatch.message.id.toString(), this.ChannelStore.getChannel(dispatch.message.channel_id).guild_id)
                }
            });
            //console.log(dispatch.message.author.id+":::"+dispatch.message.content)
        }
    }

    postMessageFromText(text,author,channelName,a,b,c){
      XenoLib.Notifications.info(`Слово-метка ${text} было использовано ${author} в канале ${channelName&&channelName.length>0 ? channelName:" приватка"}`, {
                  onClick: () => this.jumpToMessage(a,b,c),
                  timeout: 4500
                });
    }

    postMessageFromUser(text,author,channelName,a,b,c){
      XenoLib.Notifications.info(`${author} Написал ${text} в канале ${channelName}`, {
                  onClick: () => this.jumpToMessage(a,b,c),
                  timeout: 4500
                });
    }

    async showToast(content, options = {}) {
        // credits to Zere, copied from Zeres Plugin Library
        const { type = '', icon = '', timeout = 3000, onClick = () => { }, onContext = () => { } } = options;
        ZeresPluginLibrary.Toasts.ensureContainer();
        const toast = ZeresPluginLibrary['DOMTools'].parseHTML(ZeresPluginLibrary.Toasts.buildToast(content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'), ZeresPluginLibrary.Toasts.parseType(type), icon));
        toast.style.pointerEvents = 'auto';
        document.querySelector('.toasts').appendChild(toast);
        let sto2;
        const wait = () => {
          toast.classList.add('closing');
          sto2 = setTimeout(() => {
            toast.remove();
            if (!document.querySelectorAll('.toasts .toast').length) document.querySelector('.toasts').remove();
          }, 300);
        };
        const sto = setTimeout(wait, timeout);
        const toastClicked = () => {
          clearTimeout(sto);
          clearTimeout(sto2);
          wait();
        };
        toast.addEventListener('auxclick', toastClicked);
        toast.addEventListener('click', () => {
          toastClicked();
          onClick();
        });
        toast.addEventListener('contextmenu', () => {
          toastClicked();
          onContext();
        });
      }

      jumpToMessage(channelId, messageId, guildId) {
        console.log('NYA')
        console.log(channelId+" "+messageId+" "+guildId)
        ZeresPluginLibrary.DiscordModules.NavigationUtils.transitionTo(`/channels/${guildId ? guildId.toString() : '@me'}/${channelId}${messageId ? '/' + messageId : ''}`);
      }  

    stop(){
        try {
            active=false;
            this.shutdown();
        } catch (err) {
            ZeresPluginLibrary.Logger.stacktrace(this.getName(), 'Failed to stop!', err);
        }
    }

    shutdown(){
      ZeresPluginLibrary.Patcher.unpatchAll(this.getName());
    }
}
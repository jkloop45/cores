import randomWord from '../../utils/randomString';
import React , { PropTypes } from 'react';
import { Modal, Notification } from 'antd';
const confirm = Modal.confirm;
const keyConfig = {
	bindKey: [
		{
			mainKey: ['ctrl+s','command+s'],
			handler: function(props){
				var activePane = props.devpanel.panels.panes[props.devpanel.panels.activePane.key],
				tabKey = activePane.activeTab.key,
				editorId = activePane.tabs[tabKey-1].editorId,
				paneKey = props.devpanel.panels.activePane.key,
				isSave = activePane.tabs[tabKey-1].isSave;
				if(isSave == false) {
					var content = props.devpanel.panels.panes[props.devpanel.panels.activePane.key].editors[editorId].value;
					var fileName = activePane.tabs[tabKey-1].file.replace(localStorage.currentProject,localStorage.dir)
					if(fileName == '新标签页' || fileName == '新文件' || fileName == undefined || activePane.tabs[tabKey-1].file == '') {

						var type = 'editor';
						props.dispatch({
							type: 'file/showNewFileNameModal',
							payload: {type}
						});
					}else{
						props.dispatch({
							type: 'file/writeFile',
							payload: {content,tabKey: tabKey,paneKey:paneKey,fileName: fileName}
						});
						props.dispatch({
							type: 'devpanel/handleFileSave',
							payload: {
								tabKey: tabKey, pane: paneKey
							}
						});
					}
				}
			}
		},
		{
			mainKey: ['ctrl+p','command+p'],
			handler: function(props){

				if(localStorage.image != 'wechat:latest') {
					var name = 'file';
					props.dispatch({
						type: 'sidebar/setActiveMenu',
						payload: 'file'
					});
					props.dispatch({
						type: 'file/handleSearch',
						payload:{ value: '' }
					});

				}
			}
		},
		{
			mainKey: ['ctrl+c','command+c'],
			handler: function(props){

				if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
					return true;
				}

				if(localStorage.image === 'vd:site') {
					props.dispatch({
						type: 'vdCtrlTree/copyCtrl'
					})

				}
			},
			isStop: true
		},
		{
			mainKey: ['ctrl+x','command+x'],
			handler: function(props){

				if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
					return true;
				}
				if(localStorage.image === 'vd:site') {
					props.dispatch({
						type: 'vdCtrlTree/cutCtrl'
					})

				}
			},
			isStop: true
		},
		{
			mainKey: ['delete','fn+delete'],
			handler: function(props){

				if(localStorage.image === 'vd:site') {
					props.dispatch({
						type: 'vdCtrlTree/deleteCtrl',
						payload: {
                            fromKeyboard: true
                        }
					})

				}
			}
		},
		{
			mainKey: ['ctrl+v','command+v'],
			handler: function(props, event){
				if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
					return true;
				}
				if(localStorage.image === 'vd:site') {
					props.dispatch({
						type: 'vdCtrlTree/pastCtrl',
						payload: {
							type: 'after'
						}
					})

				}
			},
			isStop: true
		},
		{
			mainKey: ['option+shift+n', 'alt+shift+n'],
			handler: function (props) {
				console.log('option + shift n');
				if(localStorage.image != 'wechat:latest') {
		        	if(location.hash.indexOf('project') != -1) {
						props.dispatch({
							type: 'sidebar/handleAvailable',
		                    payload: {
		                        available: true,
		                    }
						});
						confirm({
						    title: '即将新建应用',
						    content: '您要保存工作状态后再进行新建操作吗? ',
						    onOk() {
								Notification.open({
									message: '正在保存工作状态...'
								});
								props.dispatch({
									type: 'UIState/writeConfig'
								});
		    	          		props.dispatch({
					        		type: 'sidebar/showModalNewApp'
					          	});
						    },
						    onCancel() {
								props.dispatch({
					        		type: 'sidebar/showModalNewApp'
					          	});
						    },
						});
		        	}else {
		          		props.dispatch({
			        		type: 'sidebar/showModalNewApp'
			          	});
		        	}
		        }
			}
		},
		{
			mainKey: ['option+n','alt+n'],
			handler: function(props){
				console.log('option + n');
				if(localStorage.image != 'wechat:latest') {
		          	var title = '新文件',
		              	content = '',
		              	type = 'editor',
		              	editorId = randomWord(8, 10);

					localStorage.currentSelectedFile = '新文件';

		            props.dispatch({
		            	type: 'sidebar/setActiveMenu',
		            	payload: 'file'
		            });

					// 更换默认语法
					localStorage.suffix = "js";

		          	props.dispatch({
		            	type: 'devpanel/add',
		            	payload: {title, content, type, editorId}
		          	});

				}
			}
		},
		{
			mainKey: ['alt+,','option+,'],
			handler: function(props){
				props.dispatch({
					type: 'sidebar/setActiveMenu',
					payload: 'setting'
				});
				props.dispatch({
					type: 'commandpanel/showCommandPanel'
				})
			}
		},

	],
	escape:[

	]
}
export default keyConfig;

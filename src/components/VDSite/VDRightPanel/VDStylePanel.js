import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';

const ButtonGroup = Button.Group;

import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';

import { Select } from 'antd';
import { Card, Upload } from 'antd';

const Option = Select.Option;
const OptGroup = Select.OptGroup;

const TabPane = Tabs.TabPane;

import { Collapse, Menu, Dropdown } from 'antd';
import { Row, Col, Popover } from 'antd';

import { Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import { Tree, Form, Switch, Input, Cascader, Checkbox, message, Tag, Table, Popconfirm, Slider, InputNumber} from 'antd';

const FormItem = Form.Item;

const InputGroup = Input.Group;

const Panel = Collapse.Panel;

import { SketchPicker } from 'react-color';
import css2json from 'css2json';

import ColorPicker from '../../Panel/ColorPicker.js';

// <SketchPicker style={{display: 'block'}} defaultValue="#345678" />



const VDStylePanel = (props) => {

	const colorPickerPanelOnVisibleChange = (visible) => {
		props.dispatch({
			type: 'vdstyles/colorPickerPanelOnVisibleChange',
			payload: visible
		})
	}

	if (!props.vdCtrlTree.activeCtrl.tag) {
		return (
			<div className="none-operation-obj-a">
				<Card style={{ width: 'auto', margin: '15px' }}>
				    <div>您还未添加<Tag style={{marginLeft: '8px'}} color="#87d068"><span style={{color: 'rgb(255, 255, 255)'}}>控件</span></Tag>，可以点击左侧的“控件”然后选择一个控件并添加到设计区域。<p>添加完成后可以对元素进行以下操作：</p></div>
				    <ol>
				    	<li style={{margin:'2px'}}>1、<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>元素位置</span></Tag>和<Tag color="cyan" style={{marginLeft: '8px'}}><span style={{color: 'rgb(255, 255, 255)'}}>大小</span></Tag></li>
				    	<li style={{margin:'2px'}}>2、<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>字体</span></Tag>操作</li>
				    	<li style={{margin:'2px'}}>3、<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>背景</span></Tag>操作</li>
				    	<li style={{margin:'2px'}}>4、<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>边框</span></Tag>操作</li>
				    	<li style={{margin:'2px'}}>5、<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>阴影</span></Tag>操作</li>
				    	<li style={{margin:'2px'}}>6、<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>交互动画</span></Tag></li>
				    </ol>
				</Card>
			</div>
		)
	}

	var screenSize = props.vdstyles.currentScreenSize;

	if(screenSize === 0 || screenSize == '100%') {
		var activeCSSStyleState = props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle],
			activeCSSUnitList = props.vdstyles.unitList[props.vdCtrlTree.activeCtrl.activeStyle];


	}else {

		var activeMediaQuery;

		var getActiveMediaQuery = (maxWidth) => {
			for (var i = 0; i < props.vdstyles.mediaQuery.queryList.length; i++) {
				var query = props.vdstyles.mediaQuery.queryList[i];
				if(query.maxWidth == maxWidth) {
					return query;
				}
			};
		}

		activeMediaQuery = getActiveMediaQuery(screenSize);

		var activeCSSStyleState = activeMediaQuery.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle],
			activeCSSUnitList = activeMediaQuery.unitList[props.vdCtrlTree.activeCtrl.activeStyle];		
	}

	const cssAction = {

		getAllClasses () {
			var classes = [];
			for(var key in props.vdstyles.cssStyleLayout) {
				classes.push(key);
			}
			return classes;
		}

	}

	const unitAfter = (value, property) => {
		const onSelect = (value, option) => {
			props.dispatch({
				type: 'vdstyles/changeActiveUnit',
				payload: {
					value,
					property,
					activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
				}
			});
			
			props.dispatch({
				type: 'vdstyles/applyCSSStyleIntoPage',
				payload: {
					activeCtrl: props.vdCtrlTree.activeCtrl
				}
			});

		}

		return (
		  	<Select onSelect={onSelect} size="small" value={value}>
		    	<Option style={{padding: '7px 8px'}} size="small" value="px">px</Option>
		    	<Option style={{padding: '7px 8px'}} size="small" value="em">em</Option>
		    	<Option style={{padding: '7px 8px'}} size="small" value="rem">rem</Option>
		    	<Option style={{padding: '7px 8px'}} size="small" value="vh">vh</Option>
		    	<Option style={{padding: '7px 8px'}} size="small" value="%">%</Option>
		  	</Select>
		);

	}

	const handleStylesChange = (stylePropertyName, parent, proxy) =>  {

		if(proxy == undefined) {
			proxy = parent;
		}

		var stylePropertyValue = '';
		console.log(proxy)
		if(typeof proxy == 'string') {
			stylePropertyValue = proxy;
		}else {
			stylePropertyValue = proxy.target.value;
		}

		console.log(stylePropertyValue, stylePropertyName, parent)

		if(!props.vdCtrlTree.activeCtrl.activeStyle) {
			message.error('执行错误，当前无活跃类名');
			return false;
		}

		props.dispatch({
			type: 'vdstyles/handleCSSStyleLayoutChange',
			payload: {
				stylePropertyName,
				stylePropertyValue: stylePropertyValue,
				activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle,
				parent,
			}
		});

		props.dispatch({
			type: 'vdstyles/applyCSSStyleIntoPage',
			payload: {
				activeCtrl: props.vdCtrlTree.activeCtrl
			}
		});
	}

	window.handleStylesChange = handleStylesChange;

	const setThisPropertyNull = (property) => {
		props.dispatch({
			type: 'vdstyles/setThisPropertyNull',
			payload: {
				property,
				activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
			}
		});

		props.dispatch({
			type: 'vdstyles/applyCSSStyleIntoPage',
			payload: {
				activeCtrl: props.vdCtrlTree.activeCtrl
			}
		});
	}

	const setThisPropertyImportant = (property) => {
		props.dispatch({
			type: 'vdstyles/setThisPropertyImportant',
			payload: {
				property,
				activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
			}
		});

		props.dispatch({
			type: 'vdstyles/applyCSSStyleIntoPage',
			payload: {
				activeCtrl: props.vdCtrlTree.activeCtrl
			}
		});
	}

	const cssSelector = {

		cssClassNameList () {
  			return cssAction.getAllClasses().map((item, key) => {
		    	return <Option key={key} value={item}>{item}</Option>
  			});
		},

		cssClassListForDropdown () {

			const onSelect = (e) => {
				props.dispatch({
					type: 'vdCtrlTree/setActiveStyle',
					payload: e.selectedKeys[0]
				});
			}

			return (
			  	<Menu selectedKeys={[props.vdCtrlTree.activeCtrl.activeStyle]} onSelect={onSelect}>
			  		{
			  			props.vdCtrlTree.activeCtrl.customClassName.map((item, key) => {
					    	return <Menu.Item key={item}>{
					    		props.vdCtrlTree.activeCtrl.activeStyle == item ? (
					    			<Tag color="#87d068"><span style={{color: 'rgb(255, 255, 255)'}}>{item}</span></Tag>
					    		) : (item)
					    	}</Menu.Item>
			  			})
			  		}
			  	</Menu>
			)
		},

		newStylePopover: {
			content () {

				const newStyleName = props.vdstyles.newStyleName;

				const keyWord = ['btn','navbar','dropup','label','table','glyphicon','lead']

				const onClick = () => {
					var patt = new RegExp(/^[a-zA-Z|\-|0-9]+$/),
						regResult = patt.test(newStyleName);

					if(!regResult) {
						message.error('只能输入英文大小写字母、数字和“-”');
						return false;
					}

					if(newStyleName == '') {
						message.error('请输入类名!');
						return false;
					}

					for(var key in props.vdstyles.cssStyleLayout){
						if(key == newStyleName) {
							message.error(' 类名重复，请重新输入');
							return false;
						}
					}

					for(var i=0;i<keyWord.length;i ++){
						if(newStyleName ==keyWord[i]){
							message.error(' 建议添加前缀或者更换类名');
							return false;
						}
					}

					props.dispatch({
						type: 'vdstyles/addStyle',
						payload: {
							activeStyle: props.vdCtrlTree.activeCtrl.activeStyle
						}
					});

					props.dispatch({
						type: 'vdstyles/applyCSSStyleIntoPage',
						payload: {
							activeCtrl: props.vdCtrlTree.activeCtrl
						}
					});

					props.dispatch({
						type: 'vdstyles/handleClassChange',
						payload: {
		    				value: [newStyleName],
		    				push: true
		    			}
					});

					props.dispatch({
						type: 'vdstyles/changeNewStylePopoverVisible'
					});
				}

				const handleNewStyleNameChange = (e) => {

					if(e.target.value != '') {

						var patt = new RegExp(/^[a-zA-Z|\-|0-9]+$/),
							regResult = patt.test(e.target.value);

						if(!regResult) {
							message.error('只能输入英文大小写字母、数字和“-”');
							return false;
						}

					}

					props.dispatch({
						type: 'vdstyles/handleNewStyleNameChange',
						payload: e.target.value
					});
				}

				return (
					<Row>
						<Col span={12}>
							<Input placeholder="请输入类名" onPressEnter={onClick} onChange={handleNewStyleNameChange} value={newStyleName} size="small" />
						</Col>
						<Col span={12}>
							      <Tooltip placement="bottom" title='只能输入英文大小写字母、数字和“-”,名称尽量语义化'>
							        <Icon type="question-circle-o" style={{position: 'relative', left: '30px', top: '2px'}}/>
							      </Tooltip>
							<Button onClick={onClick.bind(this)} style={{float: 'right', marginLeft: '10px'}} size="small">添加并应用</Button>
						</Col>
					</Row>
				);
			}
		}

	}

    const formItemLayout = {
      	labelCol: { span: 8 },
      	wrapperCol: { span: 16 }
    };

    const bgGradientLinearAngelMarks = {
		0: '0',
		45: '45',
		90: '90',
		135: '135',
		180: '180',
		225: '225',
		270: '270',
		315: '315',
		360: '360'
    }

    const popOverStyle = {
    	width: parseInt($(document).width()) / 3
    }

    const backgroundImageAndGradient = {
    	modifyContent: <div>222</div>,

    	imageSetter () {

    		var backgroundSizeParams = props.vdstyles.backgroundSetting.backgroundSize;
    		const handleBackgroundSizePositionChange = (cssProperty, parent, e) => {
    			var val = e.target ? e.target.value : e;
				
    			handleStylesChange(cssProperty, parent, {
    				target: {
    					value: val
    				}
    			});
    		}

    		const handleBGPosChange = (pos) => {
    			handleStylesChange('background-position', {
    				parent: 'background'
    			} ,{
    				target: {
    					value: pos
    				}
    			});
    		}
			
    		const saveBgImgLink = (e) => {
    			props.dispatch({
	        		type:'vdstyles/saveBgImgLink',
        			payload: e.target.value
    			})	
    		}

    		const handleBGImgChange = () => {
    			if(props.vdstyles.BgImgLink != "") {
	    			handleStylesChange('background-image', {
	    				parent: 'background'
	    			} ,{
	    				target: {
	    					value: props.vdstyles.BgImgLink
	    				}
	    			});
    			}
    		}

    		const skipToImggallery = {

                handleClick() {
                    props.dispatch({

                        type: 'vdcore/changeTabsPane',
                        payload: {
                        	activeTabsPane: 'assets',
                        	linkTo: 'style'
                        }

                    });

                    props.dispatch({

						type: 'vdstyles/showBackgroundStyleSettingPane',
						payload: false

					});

                }

            }
			
    		return (
			<div className="guidance-panel-wrapper">
				<div className="guidance-panel-child">
					<div className="bem-Frame">
						<div className="bem-Frame_Head">
							<div className="bem-Frame_Legend">
								<div className="bem-SpecificityLabel bem-SpecificityLabel-local bem-SpecificityLabel-text">
									{
										activeCSSStyleState['background']['background-image'] == '' ? <span>图片资源</span> : (
										  	<Popconfirm onCancel={() => { setThisPropertyImportant('background-image') }} onConfirm={() => { setThisPropertyNull('background-image') }} title="属性操作" okText="删除属性" cancelText={
								  		!activeCSSUnitList['background-image'].important ? <span>置!important</span> : <span>取消!important</span>
								  	}>
													<a href="#">图片资源</a>
												</Popconfirm>
										)
									}
								</div>
							</div>
						</div>
						<div className="bem-Frame_Body">
							<Button id="backgroundImgPaneBtn" onClick={skipToImggallery.handleClick} style={{ left: '0', top: '24px'}}><i className="fa fa-picture-o"></i>&nbsp;图片资源</Button>
							<div className="background-setting-pane-img-preview">
								{
										activeCSSStyleState['background']['background-image'] == '' ? <img style={{width: '100px', height: '65px'}} src={placeholderImgBase64}/> :
										<img style={{width: '100px', height: '65px'}} src={activeCSSStyleState['background']['background-image'].split("(")[1].split(")")[0].replace(/"/g,'')}/>
									}

							</div>
							<div>
						      	<Form className="form-no-margin-bottom" >
						      		<Row>
						      			<Col span={20}>
											<FormItem {...formItemLayout} label="图片地址:">
												{props.vdstyles.BgImgLink == "" || props.vdstyles.BgImgLink == undefined? 
													<Input 
														size="small" value={activeCSSStyleState['background']['background-image'] ? activeCSSStyleState['background']['background-image'].split("(")[1].split(")")[0].replace(/"/g,'') : ""}  
														onPressEnter={handleBGImgChange}
														onChange={saveBgImgLink.bind(this)}
													/> : 
													<Input 
														size="small" defaultValue={props.vdstyles.BgImgLink}
														onBlur={saveBgImgLink.bind(this)}
														onPressEnter={handleBGImgChange}
													/>
												}
												
											</FormItem>
										</Col>
										<Col span={4}>
											<FormItem>
												<Button onClick={handleBGImgChange} style={{marginLeft: '5px'}} size="small">应用</Button>
											</FormItem>
										</Col>	
									</Row>
							      	</Form>
							</div>
						</div>
					</div>

					<div className="bem-Frame">
						<div className="bem-Frame_Head">
							<div className="bem-Frame_Legend">
								<div className="bem-SpecificityLabel bem-SpecificityLabel-local bem-SpecificityLabel-text">
									{
										activeCSSStyleState['background']['background-size'] == '' ? <span>大小</span> : (
										  	<Popconfirm onCancel={() => { setThisPropertyImportant('background-size') }} onConfirm={() => { setThisPropertyNull('background-size') }} title="属性操作" okText="删除属性" cancelText={
								  		!activeCSSUnitList['background-size'].important ? <span>置!important</span> : <span>取消!important</span>
								  	}>
													<a href="#">大小</a>
												</Popconfirm>
										)
									}
								</div>
							</div>
						</div>
						<div className="bem-Frame_Body">

							<Row>

							  	<Col span={11} style={{paddingRight: '5px'}}>
							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="宽度">
											<Input
												value={activeCSSStyleState['background']['background-size'][0]}
												onChange={handleBackgroundSizePositionChange.bind(this, 'background-size', {parent: 'background', index: 0})} size="small" />
										</FormItem>
							      	</Form>
							  	</Col>
							  	<Col span={13} style={{paddingLeft: '5px'}}>
							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="填充">
											<Switch
												checked={activeCSSStyleState['background']['background-size'][2]}
												onChange={handleBackgroundSizePositionChange.bind(this, 'background-size', {parent: 'background', index: 2})} size="small" />
										</FormItem>
							      	</Form>
							  	</Col>

							</Row>

							<Row>

							  	<Col span={11} style={{paddingRight: '5px'}}>
							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="高度">
											<Input
												value={activeCSSStyleState['background']['background-size'][1]}
												onChange={handleBackgroundSizePositionChange.bind(this, 'background-size', {parent: 'background', index: 1})} size="small" />
										</FormItem>
							      	</Form>
							  	</Col>
							  	<Col span={13} style={{paddingLeft: '5px'}}>
							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="适应">
											<Switch
												checked={activeCSSStyleState['background']['background-size'][3]}
												onChange={handleBackgroundSizePositionChange.bind(this, 'background-size', {parent: 'background', index: 3})} size="small" />
										</FormItem>
							      	</Form>
							  	</Col>

							</Row>

						</div>
					</div>

					<div className="bem-Frame">
						<div className="bem-Frame_Head">
							<div className="bem-Frame_Legend">
								<div className="bem-SpecificityLabel bem-SpecificityLabel-local bem-SpecificityLabel-text">
									{
										activeCSSStyleState['background-position'] == '' ? <span>位置</span> : (
										  	<Popconfirm onCancel={() => { setThisPropertyImportant('background-position') }} onConfirm={() => { setThisPropertyNull('background-position') }} title="属性操作" okText="删除属性" cancelText={
								  		!activeCSSUnitList['background-position'].important ? <span>置!important</span> : <span>取消!important</span>
								  	}>
													<a href="#">位置</a>
												</Popconfirm>
										)
									}
								</div>
							</div>
						</div>
						<div className="bem-Frame_Body">

							<label style={{marginBottom: '5px'}}>预设值：</label>
							<Row>
								<Col span={10}>
									<Row style={{marginBottom: '5px'}}>
										<Col span={8}>
											<Button onClick={handleBGPosChange.bind(this, 'top left')} size="small"><Icon type="arrow-up" style={{transform: 'rotate(-45deg)'}} /></Button>
										</Col>
										<Col span={8}>
											<Button onClick={handleBGPosChange.bind(this, 'top center')} size="small"><Icon type="arrow-up" /></Button>
										</Col>
										<Col span={8}>
											<Button onClick={handleBGPosChange.bind(this, 'top right')} size="small"><Icon type="arrow-up" style={{transform: 'rotate(45deg)'}} /></Button>
										</Col>
									</Row>
									<Row style={{marginBottom: '5px'}}>
										<Col span={8}>
											<Button onClick={handleBGPosChange.bind(this, 'center left')} size="small"><Icon type="arrow-left" /></Button>
										</Col>
										<Col span={8}>
											<Button onClick={handleBGPosChange.bind(this, 'center center')} size="small"><Icon type="plus" /></Button>
										</Col>
										<Col span={8}>
											<Button onClick={handleBGPosChange.bind(this, 'center right')} size="small"><Icon type="arrow-right" /></Button>
										</Col>
									</Row>
									<Row>
										<Col span={8}>
											<Button onClick={handleBGPosChange.bind(this, 'bottom left')} size="small"><Icon type="arrow-down" style={{transform: 'rotate(45deg)'}} /></Button>
										</Col>
										<Col span={8}>
											<Button onClick={handleBGPosChange.bind(this, 'bottom center')} size="small"><Icon type="arrow-down" /></Button>
										</Col>
										<Col span={8}>
											<Button onClick={handleBGPosChange.bind(this, 'bottom right')} size="small"><Icon type="arrow-down" style={{transform: 'rotate(-45deg)'}} /></Button>
										</Col>
									</Row>
								</Col>

								<Col span={14}>
									<Form className="form-no-margin-bottom">
										<FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="top">
											<Input
												value={activeCSSStyleState['background']['background-position'][0]}
												onChange={handleBackgroundSizePositionChange.bind(this, 'background-position', {parent: 'background', index: 0})} size="small" />
										</FormItem>
										<FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="left">
											<Input
												value={activeCSSStyleState['background']['background-position'][1]}
												onChange={handleBackgroundSizePositionChange.bind(this, 'background-position', {parent: 'background', index: 1})} size="small" />
										</FormItem>
							      	</Form>
								</Col>
							</Row>

						</div>
					</div>

			      	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label={
								activeCSSStyleState['background']['background-repeat'] == '' ? <span>重复</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('background-repeat') }} onConfirm={() => { setThisPropertyNull('background-repeat') }} title="属性操作" okText="删除属性" cancelText={
								  		!activeCSSUnitList['background-repeat'].important ? <span>置!important</span> : <span>取消!important</span>
								  	}>
											<a href="#">重复</a>
										</Popconfirm>
								)
							}>

					        <RadioGroup defaultValue="repeat" size="small" value={activeCSSStyleState['background']['background-repeat']} onChange={handleStylesChange.bind(this, 'background-repeat', 'background')}>
						      	<RadioButton value="repeat">
			  		              	<Tooltip placement="top" title="repeat">
										<Icon type="appstore-o" />
						      		</Tooltip>
					      		</RadioButton>
						      	<RadioButton value="repeat-x">
			  		              	<Tooltip placement="top" title="repeat-x">
										<Icon type="ellipsis" />
						      		</Tooltip>
						      	</RadioButton>
						      	<RadioButton value="repeat-y">
			  		              	<Tooltip placement="top" title="repeat-y">
										<Icon type="ellipsis" style={{transform: 'rotate(90deg)'}} />
									</Tooltip>
						      	</RadioButton>
						      	<RadioButton value="no-repeat">
			  		              	<Tooltip placement="top" title="no-repeat">
										<Icon type="close" />
									</Tooltip>
						      	</RadioButton>
						    </RadioGroup>

						</FormItem>
			      	</Form>

			      	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label={
								activeCSSStyleState['background']['background-attachment'] == '' ? <span>固定</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('background-attachment') }} onConfirm={() => { setThisPropertyNull('background-attachment') }} title="属性操作" okText="删除属性" cancelText={
								  		!activeCSSUnitList['background-attachment'].important ? <span>置!important</span> : <span>取消!important</span>
								  	}>
											<a href="#">固定</a>
										</Popconfirm>
								)
							}>

					        <RadioGroup defaultValue="scroll" value={activeCSSStyleState['background']['background-attachment']} size="small" onChange={handleStylesChange.bind(this, 'background-attachment', 'background')}>
						      	<RadioButton value="fixed">
			  		              	<Tooltip placement="top" title="fixed">
										<Icon type="check" />
						      		</Tooltip>
					      		</RadioButton>
						      	<RadioButton value="scroll">
			  		              	<Tooltip placement="top" title="scroll">
										<Icon type="close" />
						      		</Tooltip>
						      	</RadioButton>
						    </RadioGroup>

						</FormItem>
			      	</Form>

				</div>
			</div>

    	);
		},

		gradientSetter: (

			<div style={{width: '320px'}}>

		      	<Form className="form-no-margin-bottom">
					<FormItem {...formItemLayout} label="类型">

				        <RadioGroup defaultValue="linear" size="small">
					      	<RadioButton value="linear">
		  		              	<Tooltip placement="top" title="线性渐变">
									<Icon type="swap-right" />
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="radial">
		  		              	<Tooltip placement="top" title="放射渐变">
									<Icon type="chrome" />
					      		</Tooltip>
					      	</RadioButton>
					    </RadioGroup>

					</FormItem>

					<FormItem {...formItemLayout} label="角度">
					</FormItem>

		      	</Form>

			    <Slider min={0} max={360} marks={bgGradientLinearAngelMarks} defaultValue={0} />

			    <Row style={{marginTop: '25px'}}>
			    	<Col span={12} style={{paddingRight: '15px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label="从">
								<Input type="color" size="small" />
							</FormItem>
				      	</Form>
			    	</Col>

			    	<Col span={12} style={{paddingLeft: '15px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label="渐变到">
								<Input type="color" size="small" />
							</FormItem>
				      	</Form>
			    	</Col>
			    </Row>

			</div>

		)
    }

    const changeBoxShadowPaneVisible = (visible) =>{
    	if (props.vdstyles.colorPickerPanel.visible && !visible) {
			return;
		}
		
		props.dispatch({
			type: 'vdstyles/changeBoxShadowPaneVisible'
		})
	}

    const changeTextShadowPaneVisible =(visible) =>{

    	if (props.vdstyles.colorPickerPanel.visible && !visible) {
			return;
		}

    	props.dispatch({
    		type:'vdstyles/changeTextShadowPaneVisible'
    	})
    }

    const changeNewTranstionPane =() =>{

    	props.dispatch({
    		type:'vdstyles/changeNewTranstionPane'
    	})
    }

    const changeNewTransformPane =() =>{

    	props.dispatch({
    		type:'vdstyles/changeNewTransformPane'
    	})
    }

    const shadowProps = {
    	settingPopover () {

    		const saveBoxShadow = () => {
    			props.dispatch({
    				type: 'vdstyles/saveBoxShadow',
    				payload: {
    					activeStyle: props.vdCtrlTree.activeCtrl.activeStyle,
    					shadowType: 'box-shadow'
    				}
    			});

				props.dispatch({
					type: 'vdstyles/applyCSSStyleIntoPage',
					payload: {
						activeCtrl: props.vdCtrlTree.activeCtrl
					}
				});

				changeBoxShadowPaneVisible();

    		}

    		const handleBoxShadowInputChange = (name, e) => {
    			var val = e.target ? e.target.value : e;

    			props.dispatch({
    				type: 'vdstyles/handleBoxShadowInputChange',
    				payload: {
    					value: val,
    					name,
    					shadowType: 'boxShadow'
    				}
    			});

    		}

    		return (
    		<div style={{width: 300}}>
		      	<Form className="form-no-margin-bottom">

					<FormItem {...formItemLayout} label="水平阴影">
						<Row>
					        <Col span={14} style={{paddingRight: '10px'}}>
					          	<Input onPressEnter={saveBoxShadow} type="number" onChange={handleBoxShadowInputChange.bind(this, 'h-shadow')} value={props.vdstyles.boxShadow['h-shadow'].value} size="small"/>
					        </Col>
					        <Col span={4}>
					        	PX
					        </Col>
					    </Row>
					</FormItem>

					<FormItem {...formItemLayout} label="垂直阴影">
						<Row>
					        <Col span={14} style={{paddingRight: '10px'}}>
					          	<Input onPressEnter={saveBoxShadow} type="number" onChange={handleBoxShadowInputChange.bind(this, 'v-shadow')} value={props.vdstyles.boxShadow['v-shadow'].value} size="small"/>
					        </Col>
					        <Col span={4}>
					        	PX
					        </Col>
					    </Row>
					</FormItem>

					<FormItem {...formItemLayout} label="模糊距离">
						<Row>
					        <Col span={14} style={{paddingRight: '10px'}}>
					          	<Input onPressEnter={saveBoxShadow} type="number" onChange={handleBoxShadowInputChange.bind(this, 'blur')} value={props.vdstyles.boxShadow.blur.value} size="small"/>
					        </Col>
					        <Col span={4}>
					        	PX
					        </Col>
					    </Row>
					</FormItem>

					<FormItem {...formItemLayout} label="阴影尺寸">
						<Row>
					        <Col span={14} style={{paddingRight: '10px'}}>
					          	<Input onPressEnter={saveBoxShadow} type="number" onChange={handleBoxShadowInputChange.bind(this, 'spread')} value={props.vdstyles.boxShadow.spread.value} size="small"/>
					        </Col>
					        <Col span={4}>
					        	PX
					        </Col>
					    </Row>
					</FormItem>

					<FormItem {...formItemLayout} label="颜色">
						<ColorPicker onVisibleChange={colorPickerPanelOnVisibleChange} onChangeComplete={handleBoxShadowInputChange.bind(this, 'color')} color={props.vdstyles.boxShadow.color.value}/>
					</FormItem>

					<FormItem {...formItemLayout} label="类型">
				        <RadioGroup onChange={handleBoxShadowInputChange.bind(this, 'inset')} value={props.vdstyles.boxShadow.inset.value} defaultValue="outset" size="small">
					      	<RadioButton value="outset">
								外阴影
				      		</RadioButton>
					      	<RadioButton value="inset">
								内阴影
					      	</RadioButton>
					    </RadioGroup>
					</FormItem>

					<Button onClick={saveBoxShadow} size="small">保存</Button>

		      	</Form>
    		</div>
    	);
		},

		modifyPopover () {

    		const saveBoxShadow = () => {
    			props.dispatch({
    				type: 'vdstyles/applyCSSStyleIntoPage',
					payload: {
						activeCtrl: props.vdCtrlTree.activeCtrl
					}
    			});
				message.success('保存成功');

    		}

    		const activeProp = activeCSSStyleState['box-shadow'].state.activeProp;

    		const handleBoxShadowEditorChange = (property, e) => {

    			props.dispatch({
    				type: 'vdstyles/handleBoxShadowStylesChange',
    				payload: {
    					value: e.target.value,
    					property,
    					parent: 'box-shadow',
    					activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
    				}
    			})

    		}

    		return (
	    		<div style={{width: 300}}>
			      	<Form className="form-no-margin-bottom">

						<FormItem {...formItemLayout} label="水平阴影">
							<Row>
						        <Col span={14} style={{paddingRight: '10px'}}>
						          	<Input onPressEnter={saveBoxShadow} onChange={handleBoxShadowEditorChange.bind(this, 'h-shadow')} value={activeCSSStyleState['box-shadow'].childrenProps[activeProp]['h-shadow']} size="small"/>
						        </Col>
						        <Col span={4}>
						        	PX
						        </Col>
						    </Row>
						</FormItem>

						<FormItem {...formItemLayout} label="垂直阴影">
							<Row>
						        <Col span={14} style={{paddingRight: '10px'}}>
						          	<Input onPressEnter={saveBoxShadow} onChange={handleBoxShadowEditorChange.bind(this, 'v-shadow')} value={activeCSSStyleState['box-shadow'].childrenProps[activeProp]['v-shadow']} size="small"/>
						        </Col>
						        <Col span={4}>
						        	PX
						        </Col>
						    </Row>
						</FormItem>

						<FormItem {...formItemLayout} label="模糊距离">
							<Row>
						        <Col span={14} style={{paddingRight: '10px'}}>
						          	<Input onPressEnter={saveBoxShadow} onChange={handleBoxShadowEditorChange.bind(this, 'blur')} value={activeCSSStyleState['box-shadow'].childrenProps[activeProp]['blur']} size="small"/>
						        </Col>
						        <Col span={4}>
						        	PX
						        </Col>
						    </Row>
						</FormItem>

						<FormItem {...formItemLayout} label="阴影尺寸">
							<Row>
						        <Col span={14} style={{paddingRight: '10px'}}>
						          	<Input onPressEnter={saveBoxShadow} onChange={handleBoxShadowEditorChange.bind(this, 'spread')} value={activeCSSStyleState['box-shadow'].childrenProps[activeProp]['spread']} size="small"/>
						        </Col>
						        <Col span={4}>
						        	PX
						        </Col>
						    </Row>
						</FormItem>

						<FormItem {...formItemLayout} label="颜色">
							<ColorPicker onVisibleChange={colorPickerPanelOnVisibleChange} onChangeComplete={handleBoxShadowEditorChange.bind(this, 'color')} color={activeCSSStyleState['box-shadow'].childrenProps[activeProp]['color']}/>
						</FormItem>

						<FormItem {...formItemLayout} label="类型">
					        <RadioGroup onChange={handleBoxShadowEditorChange.bind(this, 'inset')} value={activeCSSStyleState['box-shadow'].childrenProps[activeProp]['inset']} defaultValue="outset" size="small">
						      	<RadioButton value="outset">
									外阴影
					      		</RadioButton>
						      	<RadioButton value="inset">
									内阴影
						      	</RadioButton>
						    </RadioGroup>
						</FormItem>

						<Button onClick={saveBoxShadow} size="small">保存</Button>

			      	</Form>
	    		</div>
	    	);

		}

    }

    const textShadowProps = {
    	settingPopover () {

    		const saveBoxShadow = () => {
    			props.dispatch({
    				type: 'vdstyles/saveBoxShadow',
    				payload: {
    					activeStyle: props.vdCtrlTree.activeCtrl.activeStyle,
    					shadowType: 'text-shadow'
    				}
    			});

				props.dispatch({
					type: 'vdstyles/applyCSSStyleIntoPage',
					payload: {
						activeCtrl: props.vdCtrlTree.activeCtrl
					}
				});
				changeTextShadowPaneVisible();

    		}

    		const handleBoxShadowInputChange = (name, e) => {
    			var val = e.target ? e.target.value : e;

    			props.dispatch({
    				type: 'vdstyles/handleBoxShadowInputChange',
    				payload: {
    					value: val,
    					name,
    					shadowType: 'textShadow'
    				}
    			});

    		}

    		return (
    		<div style={{width: 300}}>
		      	<Form className="form-no-margin-bottom">

					<FormItem {...formItemLayout} label="水平阴影">
						<Row>
					        <Col span={14} style={{paddingRight: '10px'}}>
					          	<Input onPressEnter={saveBoxShadow} onChange={handleBoxShadowInputChange.bind(this, 'h-shadow')} value={props.vdstyles.textShadow['h-shadow'].value} size="small"/>
					        </Col>
					        <Col span={4}>
					        	PX
					        </Col>
					    </Row>
					</FormItem>

					<FormItem {...formItemLayout} label="垂直阴影">
						<Row>
					        <Col span={14} style={{paddingRight: '10px'}}>
					          	<Input onChange={handleBoxShadowInputChange.bind(this, 'v-shadow')} value={props.vdstyles.textShadow['v-shadow'].value} size="small"/>
					        </Col>
					        <Col span={4}>
					        	PX
					        </Col>
					    </Row>
					</FormItem>

					<FormItem {...formItemLayout} label="模糊距离">
						<Row>
					        <Col span={14} style={{paddingRight: '10px'}}>
					          	<Input onChange={handleBoxShadowInputChange.bind(this, 'blur')} value={props.vdstyles.textShadow.blur.value} size="small"/>
					        </Col>
					        <Col span={4}>
					        	PX
					        </Col>
					    </Row>
					</FormItem>

					<FormItem {...formItemLayout} label="颜色">
						<ColorPicker onVisibleChange={colorPickerPanelOnVisibleChange} onChangeComplete={handleBoxShadowInputChange.bind(this, 'color')} color={props.vdstyles.textShadow.color.value}/>
					</FormItem>

					<Button onClick={saveBoxShadow} size="small">保存</Button>

		      	</Form>
    		</div>
    	);
		},

		modifyPopover () {

    		const saveBoxShadow = () => {
    			props.dispatch({
    				type: 'vdstyles/applyCSSStyleIntoPage',
					payload: {
						activeCtrl: props.vdCtrlTree.activeCtrl
					}
    			});
				message.success('保存成功');
    		}

    		const activeProp = activeCSSStyleState['text-shadow'].state.activeProp;

    		const handleBoxShadowEditorChange = (property, e) => {

    			props.dispatch({
    				type: 'vdstyles/handleBoxShadowStylesChange',
    				payload: {
    					value: e.target.value,
    					property,
    					parent: 'text-shadow',
    					activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
    				}
    			})

    		}

    		return (
	    		<div style={{width: 300}}>
			      	<Form className="form-no-margin-bottom">

						<FormItem {...formItemLayout} label="水平阴影">
							<Row>
						        <Col span={14} style={{paddingRight: '10px'}}>
						          	<Input onChange={handleBoxShadowEditorChange.bind(this, 'h-shadow')} value={activeCSSStyleState['text-shadow'].childrenProps[activeProp]['h-shadow']} size="small"/>
						        </Col>
						        <Col span={4}>
						        	PX
						        </Col>
						    </Row>
						</FormItem>

						<FormItem {...formItemLayout} label="垂直阴影">
							<Row>
						        <Col span={14} style={{paddingRight: '10px'}}>
						          	<Input onChange={handleBoxShadowEditorChange.bind(this, 'v-shadow')} value={activeCSSStyleState['text-shadow'].childrenProps[activeProp]['v-shadow']} size="small"/>
						        </Col>
						        <Col span={4}>
						        	PX
						        </Col>
						    </Row>
						</FormItem>

						<FormItem {...formItemLayout} label="模糊距离">
							<Row>
						        <Col span={14} style={{paddingRight: '10px'}}>
						          	<Input onChange={handleBoxShadowEditorChange.bind(this, 'blur')} value={activeCSSStyleState['text-shadow'].childrenProps[activeProp]['blur']} size="small"/>
						        </Col>
						        <Col span={4}>
						        	PX
						        </Col>
						    </Row>
						</FormItem>

						<FormItem {...formItemLayout} label="颜色">
							<ColorPicker onVisibleChange={colorPickerPanelOnVisibleChange} onChangeComplete={handleBoxShadowEditorChange.bind(this, 'color')} color={activeCSSStyleState['text-shadow'].childrenProps[activeProp]['color']}/>
						</FormItem>

						<Button onClick={saveBoxShadow} size="small">保存</Button>

			      	</Form>
	    		</div>
	    	);

		}
    }

    const transformAndTransitionProps = {
    	transformSettingPopover () {

    		const handleTransitionInputChange = (propsName, e) => {

    			var val = e.target ? e.target.value : e;

    			props.dispatch({
    				type: 'vdstyles/handleTransitionInputChange',
    				payload: {
    					value: val,
    					propsName
    				}
    			});
    		}

    		const saveThisTransition = () => {
    			props.dispatch({
    				type: 'vdstyles/saveThisTransition',
					payload: {
						activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
					}
    			});

				props.dispatch({
					type: 'vdstyles/applyCSSStyleIntoPage',
					payload: {
						activeCtrl: props.vdCtrlTree.activeCtrl
					}
				});
				changeNewTranstionPane();
    		}

    		return (
    		<Form>
    			<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="属性" className='fa fa-search'></i>)}>
    				<Select
    				    showSearch
    				    placeholder="选择变化属性"
    				    optionFilterProp="children"
    				    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    				    value={props.vdstyles.transitionSetting['transition-property']}
    				    size="small"
    				    onChange={handleTransitionInputChange.bind(this, 'transition-property')}
    				    onPressEnter={saveThisTransition}
    				>
    				  	<OptGroup key="advanced" label="高级">
    				        <Option key="all">所有</Option>
	    				</OptGroup>

    				  	<OptGroup key="common" label="通用">
    				        <Option key="opacity">透明度</Option>
    				        <Option key="margin">外边距</Option>
	    				    <Option key="padding">内边距</Option>
	    				    <Option key="border">边框</Option>
	    				    <Option key="transform">变换</Option>
	    				    <Option key="fllter">滤镜</Option>
	    				    <Option key="flex">Flex</Option>
	    				</OptGroup>

	    				<OptGroup key="background" label="背景">
	    					<Option key="background-color">背景颜色</Option>
	    					<Option key="background-position">背景位置</Option>
	    				</OptGroup>

	    				<OptGroup key="shadows" label="阴影">
	    					<Option key="text-shadows">文字阴影</Option>
	    					<Option key="box-shadows">盒子阴影</Option>
	    				</OptGroup>

	    				<OptGroup key="size" label="大小">
	    					<Option key="width">宽度</Option>
	    					<Option key="height">高度</Option>
	    					<Option key="min-height">最小高度</Option>
	    					<Option key="max-height">最大高度</Option>
	    					<Option key="min-width">最小高度</Option>
	    					<Option key="max-width">最大高度</Option>
	    				</OptGroup>

	    				<OptGroup key="borders" label="边框">
	    					<Option key="border-radius">边框弧度</Option>
	    					<Option key="border-color">边框颜色</Option>
	    					<Option key="border-width">边框宽度</Option>
	    				</OptGroup>

	    				<OptGroup key="typo" label="字体">
	    					<Option key="color">颜色</Option>
	    					<Option key="font-size">大小</Option>
	    					<Option key="line-height">行高</Option>
	    					<Option key="letter-spacing">词间距(letter)</Option>
	    					<Option key="word-spacing">词间距(word)</Option>
	    					<Option key="text-indent">缩进</Option>
	    				</OptGroup>

	    				<OptGroup key="position" label="位置">
	    					<Option key="top">顶部</Option>
	    					<Option key="left">左部</Option>
	    					<Option key="right">右部</Option>
	    					<Option key="bottom">底部</Option>
	    					<Option key="z-index">z-index</Option>
	    				</OptGroup>

	    				<OptGroup key="margin" label="外边距">
	    					<Option key="margin-left">左外边距</Option>
	    					<Option key="margin-right">右外边距</Option>
	    					<Option key="margin-top">顶外边距</Option>
	    					<Option key="margin-bottom">底外边距</Option>
	    				</OptGroup>

	    				<OptGroup key="padding" label="内边距">
	    					<Option key="padding-left">左内边距</Option>
	    					<Option key="padding-right">右内边距</Option>
	    					<Option key="padding-top">上内边距</Option>
	    					<Option key="padding-bottom">底内边距</Option>
	    				</OptGroup>

	    				<OptGroup key="flex" label="Flex">
	    					<Option key="flex-grow">Flex Grow</Option>
	    					<Option key="flex-shrink">Flex Shrink</Option>
	    					<Option key="flex-basis">Flex Basis</Option>
	    				</OptGroup>

    				</Select>
    			</FormItem>

    			<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="时间" className='fa fa-clock-o'></i>)}>
					<Row>
				        <Col span={18}>
				          	<Input
				          		onPressEnter={saveThisTransition}
    				    		onChange={handleTransitionInputChange.bind(this, 'transition-duration')}
    				    		type="number"
				          		value={props.vdstyles.transitionSetting['transition-duration']} type="text" size="small" />
				        </Col>
				        <Col span={6} style={{paddingLeft: '15px'}}>
				        	s
				        </Col>
				    </Row>
				</FormItem>

				<InputGroup compact>
					<Row>
						<Col span={4}>
							曲线：
						</Col>
						<Col span={8}>
			      			<Input onPressEnter={saveThisTransition} size="small" disabled={false} value="ease" />
						</Col>
						<Col span={12} style={{paddingLeft: '15px'}}>
					      	<Select
					      		onPressEnter={saveThisTransition}
    				    		onChange={handleTransitionInputChange.bind(this, 'transition-timing-function')}
		    				    placeholder="变化速度曲线"
								value={props.vdstyles.transitionSetting['transition-timing-function']}
		    				    size="small"
		    				>
		    					<Option key="ease">Ease</Option>
		    					<Option key="linear">Linear</Option>
		    					<Option key="ease-in">Ease In</Option>
		    					<Option key="ease-out">Ease Out</Option>
		    					<Option key="ease-in-out">Ease In Out</Option>
		    					<Option key="cubic-bezier">cubic Bezier</Option>
		    				</Select>
						</Col>
					</Row>
			    </InputGroup>
    			<FormItem wrapperCol={{span: 24}} label="">
				    <Button onClick={saveThisTransition.bind(this)} size="small" style={{marginTop: '15px', float: 'right'}}>保存</Button>
    			</FormItem>
    		</Form>
    	);
		},

    	transitionSttingPopover: (
			<Form className="form-no-margin-bottom">
				<FormItem label="起始位置" {...formItemLayout}></FormItem>

				<div style={{border: 'solid 1px #d9d9d9', padding: 5}}>
					<InputGroup compact>
						<div style={{width: '30%', display: 'inline-block'}}>
							水平方向:
						</div>
						<Input style={{ width: '40%' }} defaultValue="0" />
				      	<Select
	    				    placeholder="选择单位"
	    				    defaultValue="PX"
	    				    style={{ width: '30%' }}
	    				>
	    					<Option key="PX">PX</Option>
	    					<Option key="%">%</Option>
	    				</Select>
				    </InputGroup>

    				<InputGroup compact style={{marginTop: 5}}>
						<div style={{width: '30%', display: 'inline-block'}}>
							垂直方向:
						</div>
						<Input style={{ width: '40%' }} defaultValue="0" />
				      	<Select
	    				    placeholder="选择单位"
	    				    defaultValue="PX"
	    				    style={{ width: '30%' }}
	    				>
	    					<Option key="PX">PX</Option>
	    					<Option key="%">%</Option>
	    				</Select>
				    </InputGroup>
				</div>

				<FormItem {...formItemLayout} label="从自身看">
					<Row>
				        <Col span={13}>
				          	<Slider min={1} max={2000}/>
				        </Col>
				        <Col span={3}>
				          	<InputNumber/>
				        </Col>
				        <Col span={1}>PX</Col>
				    </Row>
				</FormItem>

				<FormItem {...formItemLayout} label="背面">
					<RadioGroup defaultValue="cansee" size="small">
				      	<RadioButton value="cansee">
	  		              	<i className="fa fa-eye"></i>
			      		</RadioButton>
			      		<RadioButton value="nosee">
	  		              	<i className="fa fa-eye-slash"></i>
			      		</RadioButton>
			      	</RadioGroup>
				</FormItem>
			</Form>
    	),

    	transitionAddPopover () {

    		const saveTransform = () => {
    			props.dispatch({
    				type: 'vdstyles/saveTransform',
					payload: {
						activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
					}
    			});

				props.dispatch({
					type: 'vdstyles/applyCSSStyleIntoPage',
					payload: {
						activeCtrl: props.vdCtrlTree.activeCtrl
					}
				});
    		}

    		const handleTabChange = (transformType) => {
    			props.dispatch({
    				type: 'vdstyles/changeTransformType',
					payload: {
						transformType
					}
    			});
    		}

    		const handleTransformInputChange = (pos, e) => {
    			props.dispatch({
    				type: 'vdstyles/handleTransformInputChange',
    				payload: {
    					pos,
    					value: e.target.value
    				}
    			});
    		}

    		return (
			<Tabs activeKey={props.vdstyles.transformSetting.name} size="small" animated={false} onChange={handleTabChange}>
			    <TabPane tab="移动" key="translate" style={{padding: 10}}>

			      	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label="x轴">
							<Row>
								<Col span={18} style={{paddingRight: '15px'}}>
									<Input onPressEnter={saveTransform} type="number" size="small" onChange={handleTransformInputChange.bind(this, 'x')} value={props.vdstyles.transformSetting.x}/>
								</Col>
								<Col span={6} style={{textAlign: 'right'}}>
									px
								</Col>
							</Row>
						</FormItem>

						<FormItem {...formItemLayout} label="y轴">
							<Row>
								<Col span={18} style={{paddingRight: '15px'}}>
									<Input onPressEnter={saveTransform} type="number" size="small" onChange={handleTransformInputChange.bind(this, 'y')} value={props.vdstyles.transformSetting.y}/>
								</Col>
								<Col span={6} style={{textAlign: 'right'}}>
									px
								</Col>
							</Row>
						</FormItem>
			      	</Form>

					<Button onClick={saveTransform} style={{float: 'right'}} size="small">保存</Button>
			    </TabPane>
			    <TabPane tab="缩放" key="scale" style={{padding: 10}}>
			      	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label="x轴">
							<Row>
								<Col span={18} style={{paddingRight: '15px'}}>
									<Input onPressEnter={saveTransform} type="number" size="small" onChange={handleTransformInputChange.bind(this, 'x')} value={props.vdstyles.transformSetting.x}/>
								</Col>
								<Col span={6} style={{textAlign: 'right'}}>
									倍率
								</Col>
							</Row>
						</FormItem>

						<FormItem {...formItemLayout} label="y轴">
							<Row>
								<Col span={18} style={{paddingRight: '15px'}}>
									<Input onPressEnter={saveTransform} type="number" size="small" onChange={handleTransformInputChange.bind(this, 'y')} value={props.vdstyles.transformSetting.y}/>
								</Col>
								<Col span={6} style={{textAlign: 'right'}}>
									倍率
								</Col>
							</Row>
						</FormItem>

			      	</Form>
					<Button onClick={saveTransform} style={{float: 'right'}} size="small">保存</Button>
			    </TabPane>
			    <TabPane tab="旋转" key="rotate" style={{padding: 10}}>
			      	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label="旋转角度">
							<Row>
								<Col span={18} style={{paddingRight: '15px'}}>
									<Input onPressEnter={saveTransform} type="number" size="small" onChange={handleTransformInputChange.bind(this, 'x')} value={props.vdstyles.transformSetting.x}/>
								</Col>
								<Col span={6} style={{textAlign: 'right'}}>
									deg
								</Col>
							</Row>
						</FormItem>
			      	</Form>
					<Button onClick={saveTransform} style={{float: 'right'}} size="small">保存</Button>
			    </TabPane>
			    <TabPane tab="倾斜" key="skew" style={{padding: 10}}>
			      	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label="x轴">
							<Row>
								<Col span={18} style={{paddingRight: '15px'}}>
									<Input onPressEnter={saveTransform} type="number" size="small" onChange={handleTransformInputChange.bind(this, 'x')} value={props.vdstyles.transformSetting.x}/>
								</Col>
								<Col span={6} style={{textAlign: 'right'}}>
									deg
								</Col>
							</Row>
						</FormItem>

						<FormItem {...formItemLayout} label="y轴">
							<Row>
								<Col span={18} style={{paddingRight: '15px'}}>
									<Input onPressEnter={saveTransform} type="number" size="small" onChange={handleTransformInputChange.bind(this, 'y')} value={props.vdstyles.transformSetting.y}/>
								</Col>
								<Col span={6} style={{textAlign: 'right'}}>
									deg
								</Col>
							</Row>
						</FormItem>

			      	</Form>
					<Button onClick={saveTransform} style={{float: 'right'}} size="small">保存</Button>
			    </TabPane>
			</Tabs>
    	);}
    }

    const effectProps = {
    	cursorPopover () {

    		const changeCursor = (cursor) => {
				handleStylesChange('cursor', {
					target: {
						value: cursor
					}
				});

				props.dispatch({
					type: 'vdstyles/togglePopover',
					payload: { popoverName: 'cursor' }
				});
    		}

    		return (
	    		<div>
	    			<p>普通的</p>
	    			<ButtonGroup>
	    				<Button onClick={changeCursor.bind(this, 'default')} style={{cursor: 'default'}}>default</Button>
	    				<Button onClick={changeCursor.bind(this, 'none')} style={{cursor: 'none'}}>none</Button>
	    			</ButtonGroup>

	    			<li style={{marginBottom: 8, marginTop: 8}} className="ant-dropdown-menu-item-divider"></li>

	    			<p>链接 & 状态</p>
	    			<ButtonGroup>
	    				<Button onClick={changeCursor.bind(this, 'pointer')} style={{cursor: 'pointer'}}>pointer</Button>
	    				<Button onClick={changeCursor.bind(this, 'not-allowed')} style={{cursor: 'not-allowed'}}>not-allowed</Button>
	    				<Button onClick={changeCursor.bind(this, 'wait')} style={{cursor: 'wait'}}>wait</Button>
	    				<Button onClick={changeCursor.bind(this, 'progress')} style={{cursor: 'progress'}}>progress</Button>
	    				<Button onClick={changeCursor.bind(this, 'help')} style={{cursor: 'help'}}>help</Button>
	    				<Button onClick={changeCursor.bind(this, 'context-menu')} style={{cursor: 'context-menu'}}>context-menu</Button>
	    			</ButtonGroup>

	    			<li style={{marginBottom: 8, marginTop: 8}} className="ant-dropdown-menu-item-divider"></li>

	    			<p>选择</p>
	    			<ButtonGroup>
	    				<Button onClick={changeCursor.bind(this, 'cell')} style={{cursor: 'cell'}}>cell</Button>
	    				<Button onClick={changeCursor.bind(this, 'crosshair')} style={{cursor: 'crosshair'}}>crosshair</Button>
	    				<Button onClick={changeCursor.bind(this, 'text')} style={{cursor: 'text'}}>text</Button>
	    				<Button onClick={changeCursor.bind(this, 'vertical-text')} style={{cursor: 'vertical-text'}}>vertical-text</Button>
	    			</ButtonGroup>

	    			<li style={{marginBottom: 8, marginTop: 8}} className="ant-dropdown-menu-item-divider"></li>

	    			<p>拖拽</p>
	    			<ButtonGroup>
	    				<Button onClick={changeCursor.bind(this, 'grab')} style={{cursor: 'grab'}}>grab</Button>
	    				<Button onClick={changeCursor.bind(this, 'grabbing')} style={{cursor: 'grabbing'}}>grabbing</Button>
	    				<Button onClick={changeCursor.bind(this, 'alias')} style={{cursor: 'alias'}}>alias</Button>
	    				<Button onClick={changeCursor.bind(this, 'copy')} style={{cursor: 'copy'}}>copy</Button>
	    				<Button onClick={changeCursor.bind(this, 'move')} style={{cursor: 'move'}}>move</Button>
	    			</ButtonGroup>

	    			<li style={{marginBottom: 8, marginTop: 8}} className="ant-dropdown-menu-item-divider"></li>

	    			<p>缩放</p>
	    			<ButtonGroup>
	    				<Button onClick={changeCursor.bind(this, 'zoom-in')} style={{cursor: 'zoom-in'}}>zoom-in</Button>
	    				<Button onClick={changeCursor.bind(this, 'zoom-out')} style={{cursor: 'zoom-out'}}>zoom-out</Button>
	    			</ButtonGroup>

	    			<li style={{marginBottom: 8, marginTop: 8}} className="ant-dropdown-menu-item-divider"></li>

	    			<p>改变大小</p>
	    			<ButtonGroup>
	    				<Button onClick={changeCursor.bind(this, 'col-resize')} style={{cursor: 'col-resize'}}>col-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'row-resize')} style={{cursor: 'row-resize'}}>row-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'nesw-resize')} style={{cursor: 'nesw-resize'}}>nesw-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'nwse-resize')} style={{cursor: 'nwse-resize'}}>nwse-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'ew-resize')} style={{cursor: 'ew-resize'}}>ew-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'ns-resize')} style={{cursor: 'ns-resize'}}>ns-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'n-resize')} style={{cursor: 'n-resize'}}>n-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'w-resize')} style={{cursor: 'w-resize'}}>w-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 's-resize')} style={{cursor: 's-resize'}}>s-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'e-resize')} style={{cursor: 'e-resize'}}>e-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'nw-resize')} style={{cursor: 'nw-resize'}}>nw-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'ne-resize')} style={{cursor: 'ne-resize'}}>ne-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'sw-resize')} style={{cursor: 'sw-resize'}}>sw-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'se-resize')} style={{cursor: 'se-resize'}}>se-resize</Button>
	    			</ButtonGroup>

	    		</div>
	    	);
		}
    }

    const cssClassProps = {

    	onClassNameSelectChange (selected) {
    		props.dispatch({
    			type: 'vdstyles/handleClassChange',
    			payload: {
    				value: selected
    			}
    		})
    	}

    }

    const vdctrlCollapse = () => {

    	const cssStateMenu = () => {

    		const onSelect = ({ item, key, selectedKeys }) => {

    			props.dispatch({
    				type: 'vdstyles/handleCSSStateChange',
    				payload: {
    					selectedKeys: selectedKeys[0],
    					stateName: item.props.children
    				}
    			});

    			if(selectedKeys[0] == 'none') {
    				var acs = props.vdCtrlTree.activeCtrl.activeStyle;

					props.dispatch({
						type: 'vdCtrlTree/setActiveStyle',
						payload: props.vdCtrlTree.activeCtrl.activeStyle.split(':')[0]
					});
    			}else {
	    			props.dispatch({
	    				type: 'vdstyles/addStyle',
	    				payload: {
							activeStyle: props.vdCtrlTree.activeCtrl.activeStyle,
							cssState: selectedKeys[0]
	    				}
	    			});

					props.dispatch({
						type: 'vdstyles/applyCSSStyleIntoPage',
						payload: {
							activeCtrl: props.vdCtrlTree.activeCtrl
						}
					});

					props.dispatch({
						type: 'vdstyles/handleClassChange',
						payload: {
		    				value: props.vdCtrlTree.activeCtrl.activeStyle.split(':')[0] + ':' + selectedKeys[0],
		    				push: true,
		    				dontChangeAttr: true
		    			}
					});

    			}

    		}

	    	return (
			  	<Menu onSelect={onSelect} selectedKeys={[props.vdstyles.activeCSSState]}>
			  		{
			    		props.vdstyles.cssStates.map( (state, index) => {
			    			return(
			    				<Menu.Item key={state.key}>{state.name}</Menu.Item>
			    			);
			    		})
			  		}
			  	</Menu>
	    	);
    	}

    	const linkToStylesManager = (e) =>{
				props.dispatch({
					type: 'vdcore/changeTabsPane',
					payload: {
						activeTabsPane: 'styles-manager',
          				linkTo: '',
					}
				});
				e.stopPropagation();
				return false;
    	}

    	const changeNewStylePopoverVisible= () =>{
    			props.dispatch({
    				type: 'vdstyles/changeNewStylePopoverVisible'
    			})
    	}

    	const cssPanel = (

			<Panel header={<span><i className="fa fa-css3"></i>&nbsp;CSS类选择器<Button size="small" style={{marginLeft: "8px"}} onClick={linkToStylesManager}>样式管理</Button></span>} key="css">
				<Row>
					<Col span={18}>
					  	<div style={{marginBottom: '10px',marginTop: '5px'}}>当前类名：<Tag color="#87d068"><span style={{color: 'rgb(255, 255, 255)'}}>{props.vdCtrlTree.activeCtrl.activeStyle || '无活跃类名'}</span></Tag></div>
					</Col>
					<Col span={6} style={{textAlign: 'right'}}>
					  	<Dropdown overlay={cssStateMenu()}>
					    	<p hidden={!props.vdCtrlTree.activeCtrl.activeStyle} style={{cursor: 'pointer'}}>
					      		{props.vdstyles.activeCSSStateName} <Icon type="down" />
					    	</p>
					  	</Dropdown>
					</Col>
				</Row>
		    	<Row>
      				<Col span={3}>
      				    <Popover placement="bottom" overlayClassName="vd-style-panel-popover-bg-color" content={cssSelector.newStylePopover.content()} visible={props.vdstyles.newStylePopover.visible} onVisibleChange={changeNewStylePopoverVisible}>
						  	<Button style={{marginBottom: '10px', marginLeft: '-1px'}} size="small">
		  		              	<Tooltip placement="left" title="新增一个样式并应用">
							  		<i className="fa fa-plus"></i>
		      					</Tooltip>
						  	</Button>
				  	    </Popover>
      				</Col>
				  	<Col span={18} className="css-selector">
				      	<Select
					    	multiple
					    	style={{ width: '100%' }}
					    	placeholder="选择CSS类名应用到控件上"
					    	onChange={cssClassProps.onClassNameSelectChange.bind(this)}
					    	value={
					    		props.vdCtrlTree.activeCtrl.customClassName
					    	}
					    	size="small"
					  	>
					    	{cssSelector.cssClassNameList()}
					  	</Select>
				  	</Col>
      				<Col span={3}>
      				    <Dropdown overlay={cssSelector.cssClassListForDropdown()}>
						  	<Button style={{marginBottom: '10px', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', marginLeft: '-1px'}} size="small">
		  		              	<Tooltip placement="left" title="选择CSS类进行编辑">
							  		<i className="fa fa-pencil"></i>
		      					</Tooltip>
						  	</Button>
				  	    </Dropdown>
      				</Col>
  				</Row>
		    </Panel>

    	);

		const layoutPanel = () => {

			const setMarginCenter = (checked) => {
				props.dispatch({
					type: 'vdstyles/setMarginCenter',
					payload: {
						property: 'margin-center',
						checked,
						activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
					}
				});

				props.dispatch({
					type: 'vdstyles/applyCSSStyleIntoPage',
					payload: {
						activeCtrl: props.vdCtrlTree.activeCtrl
					}
				});
			}

			return (
		    <Panel header="布局" key="layout">

				<div className="guidance-panel-wrapper">
					<div className="guidance-panel-child">
						<div className="bem-Frame">
							<div className="bem-Frame_Head">
								<div className="bem-Frame_Legend">
									<div className="bem-SpecificityLabel bem-SpecificityLabel-local bem-SpecificityLabel-text">
										{
											activeCSSStyleState['display'] == '' ? <span>Display 设置</span> : (
											  	<Popconfirm onCancel={() => { setThisPropertyImportant('display') }} onConfirm={() => { setThisPropertyNull('display') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['display'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
		 											<a href="#">Display 设置</a>
		  										</Popconfirm>
											)
										}
									</div>
								</div>
							</div>
							<div className="bem-Frame_Body" id="display-body">

						        <RadioGroup defaultValue="block" value={activeCSSStyleState['display']} size="small" onChange={handleStylesChange.bind(this, 'display')}>
							      	<RadioButton value="block">
				  		              	<Tooltip placement="top" title="块级">
							      			<svg width="18" height="14" viewBox="0 0 22 14" className="bem-Svg " style={{marginTop:'3px', display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".15" fill="currentColor" d="M19 3v8H3V3h16m1-1H2v10h18V2z"></path><path fill="currentColor" d="M19.8 1H2.2A1.2 1.2 0 0 0 1 2.2v9.6A1.2 1.2 0 0 0 2.2 13h17.6a1.2 1.2 0 0 0 1.2-1.2V2.2A1.2 1.2 0 0 0 19.8 1zm.2 11H2V2h18v10z"></path><path opacity=".35" fill="currentColor" d="M3 3h16v8H3z"></path></svg>
							      		</Tooltip>
						      		</RadioButton>
							      	<RadioButton value="inline-block">
				  		              	<Tooltip placement="top" title="行内块级">
											<svg width="28" height="14" viewBox="0 0 28 14" className="bem-Svg " style={{marginTop:'3px', display: 'block', transform: 'translate(0px, 0px)'}}><path fill="currentColor" d="M25 3v8H3V3h22m1-1H2v10h24V2z" opacity=".15"></path><path opacity=".35" fill="currentColor" d="M8.418 9.8H7.66L7.25 11h1.58l-.232-.676-.18-.525zM3 11h.567l2.916-7.94h3.15L11 6.78V3H3v8zm15.12-1.002a3.302 3.302 0 0 1-.48-.586c-.173.343-.42.653-.73.888.002 0 .004-.002.005-.003l-.008.006.003-.003a3.145 3.145 0 0 1-1.092.55c-.4.11-.825.15-1.303.15h6.017a4.416 4.416 0 0 1-1.12-.215 3.51 3.51 0 0 1-1.292-.787zM14.237 3c.49 0 .853.014 1.167.06.335.05.656.16.953.314h.003l.004.003c.365.19.694.492.898.866.13.234.197.49.24.747.16-.298.343-.58.578-.82v-.002c.358-.366.8-.643 1.287-.826a4.373 4.373 0 0 1 1.557-.272 5.67 5.67 0 0 1 1.442.18l.01.002.01.003c.205.06.4.126.59.208.15.064.283.125.407.185l.562.274v3.016h-1.54l-.28-.24a7.018 7.018 0 0 0-.233-.188 2.703 2.703 0 0 0-.26-.175 1.594 1.594 0 0 0-.277-.125h-.006l-.2-.03a.772.772 0 0 0-.26.042l-.16.102a.63.63 0 0 0-.13.22 1.486 1.486 0 0 0-.075.516c0 .266.04.436.074.513a.59.59 0 0 0 .13.212l.15.09h.003a.868.868 0 0 0 .265.045l.236-.037h.008a1.04 1.04 0 0 0 .25-.113l.007-.004.01-.005.24-.16a6.41 6.41 0 0 0 .216-.17l.285-.254h1.536v3.017l-.59.266c-.15.066-.292.13-.422.184a4.19 4.19 0 0 1-.53.19 5.918 5.918 0 0 1-.636.15c-.076.012-.16.02-.24.026H25V3H14.237z"></path><path fill="currentColor" d="M25.8 1H2.2A1.2 1.2 0 0 0 1 2.2v9.6A1.2 1.2 0 0 0 2.2 13h23.6a1.2 1.2 0 0 0 1.2-1.2V2.2A1.2 1.2 0 0 0 25.8 1zm.2 11H2V2h24v10zm-7.186-2.72c.258.248.567.435.927.56s.76.19 1.18.19c.29 0 .51-.014.68-.042.167-.028.34-.07.53-.123.143-.04.28-.09.41-.146l.412-.19V8.16h-.154c-.07.06-.157.134-.265.22a3.337 3.337 0 0 1-.35.237 2.11 2.11 0 0 1-.485.22 1.798 1.798 0 0 1-1.1-.01 1.403 1.403 0 0 1-.523-.3c-.15-.14-.28-.33-.38-.57a2.36 2.36 0 0 1-.152-.9c0-.347.047-.64.14-.88s.216-.433.367-.58c.157-.15.33-.26.517-.325a1.786 1.786 0 0 1 1.116-.014c.164.056.316.125.457.206a4.868 4.868 0 0 1 .644.466h.17V4.54a13.03 13.03 0 0 0-.367-.168 3.667 3.667 0 0 0-1.005-.27 4.736 4.736 0 0 0-.65-.04c-.436 0-.837.07-1.205.207s-.675.333-.924.59c-.26.262-.457.58-.59.95S18 6.6 18 7.055c0 .488.07.918.213 1.29s.343.683.6.933zm-3.264.607c.272-.076.52-.2.75-.38.195-.15.35-.338.46-.567.113-.23.17-.488.17-.778 0-.4-.11-.722-.332-.967-.22-.245-.52-.406-.896-.484v-.03a1.46 1.46 0 0 0 .623-.51 1.36 1.36 0 0 0 .22-.77c0-.25-.052-.47-.16-.665a1.15 1.15 0 0 0-.49-.465 2.065 2.065 0 0 0-.64-.215A7.67 7.67 0 0 0 14.237 4H12v6h2.515c.418 0 .763-.037 1.035-.113zM13.478 5.1h.14c.29 0 .517.002.678.006s.296.027.404.07c.12.05.206.123.253.223a.69.69 0 0 1 .072.29.86.86 0 0 1-.062.34c-.042.1-.13.18-.263.24a1.05 1.05 0 0 1-.39.08c-.166.007-.366.01-.6.01h-.233V5.1zm.108 3.8h-.108V7.405h.324c.222 0 .434 0 .638.004.203 0 .363.02.48.05.17.05.29.13.36.23s.106.25.106.44c0 .144-.03.272-.087.384s-.17.2-.32.27a1.257 1.257 0 0 1-.5.104c-.18.003-.48.004-.9.004zm-6.64-.1h2.187l.41 1.2h1.574L8.935 4.06H7.182L5 10h1.535l.412-1.2zM8.04 5.58l.727 2.13H7.313l.727-2.13z"></path></svg>
							      		</Tooltip>
							      	</RadioButton>
							      	<RadioButton value="inline">
				  		              	<Tooltip placement="top" title="行内">
											<svg width="18" height="8" viewBox="0 0 20 8" className="bem-Svg " style={{marginTop:'5px', display: 'block', transform: 'translate(0px, 0px)'}}><path fill="currentColor" d="M14.814 6.25c.258.248.567.435.927.56s.76.19 1.18.19c.29 0 .51-.014.68-.042.167-.028.34-.07.53-.123.143-.04.28-.09.41-.146l.41-.19V5.13h-.153c-.07.06-.157.134-.265.22a3.337 3.337 0 0 1-.35.237 2.11 2.11 0 0 1-.484.22 1.798 1.798 0 0 1-1.1-.01 1.403 1.403 0 0 1-.523-.3 1.566 1.566 0 0 1-.38-.57c-.1-.24-.152-.54-.152-.9 0-.346.048-.638.14-.878s.217-.437.368-.58c.16-.155.33-.26.52-.33a1.786 1.786 0 0 1 1.117-.013c.165.055.317.124.458.205a4.385 4.385 0 0 1 .643.47h.17V1.52c-.107-.05-.23-.107-.37-.168a3.613 3.613 0 0 0-1.003-.27 4.736 4.736 0 0 0-.65-.04c-.436 0-.837.07-1.205.207s-.674.33-.923.59c-.26.26-.458.58-.59.95S14 3.57 14 4.02c0 .488.07.918.213 1.29s.343.683.6.933zm-3.264.608c.272-.075.52-.2.75-.377a1.5 1.5 0 0 0 .46-.56 1.72 1.72 0 0 0 .17-.77c0-.4-.11-.72-.332-.96-.22-.244-.52-.404-.896-.48v-.04a1.46 1.46 0 0 0 .623-.516c.147-.22.22-.474.22-.763 0-.25-.052-.47-.16-.66a1.152 1.152 0 0 0-.49-.46 2.06 2.06 0 0 0-.64-.212A7.67 7.67 0 0 0 10.237 1H8v5.97h2.515c.418 0 .763-.037 1.035-.112zM9.478 2.095h.14c.29 0 .517.002.678.006.162.01.296.03.404.07a.46.46 0 0 1 .253.23.69.69 0 0 1 .072.298.85.85 0 0 1-.062.34.492.492 0 0 1-.263.24 1.052 1.052 0 0 1-.39.08c-.166.006-.366.01-.6.01h-.232v-1.27zm.108 3.78h-.108V4.388h.324c.222 0 .434 0 .638.004a1.8 1.8 0 0 1 .48.056c.17.05.29.127.36.23.07.104.106.25.106.44 0 .144-.03.272-.087.383s-.17.2-.32.27-.32.1-.5.11c-.18.004-.48.004-.9.004zm-6.64-.106h2.187l.41 1.2h1.574L4.935 1.03H3.182L1 6.97h1.535l.412-1.2zM4.04 2.55l.727 2.13H3.313l.727-2.13z"></path></svg>
										</Tooltip>
							      	</RadioButton>
							      	<RadioButton value="flex">
				  		              	<Tooltip placement="top" title="flex">
											<svg width="18" height="14" viewBox="0 0 23 14" className="bem-Svg " style={{marginTop:'3px', display: 'block', transform: 'translate(0px, 0px)'}}><g fill="currentColor" fillRule="evenodd"><path d="M21 2v10H2V2h19zm1-1H1v12h21V1z" opacity=".15"></path><path d="M1.2 0A1.2 1.2 0 0 0 0 1.2v11.6A1.2 1.2 0 0 0 1.2 14h20.6a1.2 1.2 0 0 0 1.2-1.2V1.2A1.2 1.2 0 0 0 21.8 0H1.2zM22 13H1V1h21v12z"></path><path opacity=".4" d="M3 3h5v8H3z"></path><path d="M4 4v6h3V4H4zm4-1v8H3V3h5z"></path><path opacity=".4" d="M9 3h5v8H9z"></path><path d="M10 4v6h3V4h-3zm4-1v8H9V3h5z"></path><path opacity=".4" d="M15 3h5v8h-5z"></path><path d="M16 4v6h3V4h-3zm4-1v8h-5V3h5z"></path></g></svg>
										</Tooltip>
							      	</RadioButton>
							      	<RadioButton value="none">
				  		              	<Tooltip placement="top" title="无">
											<svg width="15" height="15" viewBox="0 0 15 15" className="bem-Svg " style={{marginTop:'3px', display: 'block', transform: 'translate(0px, 0px)'}}><path fill="currentColor" d="M12.146 5.27l-1.29 1.29c.084.3.144.612.144.94C11 9.434 9.434 11 7.502 11c-.33 0-.64-.06-.943-.145l-.797.795c.554.214 1.135.35 1.738.35 3.59 0 6.5-4.56 6.5-4.56s-.71-1.078-1.854-2.17zm.5-3.624l-2.26 2.26C9.516 3.38 8.54 3 7.5 3 3.91 3 1 7.44 1 7.44s1.112 1.724 2.8 3.053l-2.153 2.153.707.707 11-11-.708-.707zM8.25 6.044a1.62 1.62 0 0 0-.748-.2c-.918 0-1.658.74-1.658 1.654 0 .274.083.523.2.75l-1.328 1.33A3.433 3.433 0 0 1 4 7.5 3.5 3.5 0 0 1 7.502 4a3.43 3.43 0 0 1 2.075.716L8.25 6.044z"></path></svg>
										</Tooltip>
							      	</RadioButton>
							    </RadioGroup>

							</div>
						</div>
					</div>
				</div>

		    	<Row>

				  	<Col span={12} style={{paddingRight: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['padding']['padding-top'] == '' ? <span>上内边距</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('padding-top') }} onConfirm={() => { setThisPropertyNull('padding-top') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['padding-top'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">上内边距</a>
										</Popconfirm>
								)
							}>
								<Input
									addonAfter={unitAfter(activeCSSUnitList['padding-top'].unit, 'padding-top')}
									size="small"
									type="number"
									value={activeCSSStyleState['padding']['padding-top']}
									onChange={handleStylesChange.bind(this, 'padding-top')}/>
							</FormItem>
				      	</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['padding']['padding-bottom'] == '' ? <span>下内边距</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('padding-bottom') }} onConfirm={() => { setThisPropertyNull('padding-bottom') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['padding-bottom'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">下内边距</a>
										</Popconfirm>
								)
							}>
								<Input
									type="number"
									addonAfter={unitAfter(activeCSSUnitList['padding-bottom'].unit, 'padding-bottom')}
								 	size="small" value={activeCSSStyleState['padding']['padding-bottom']} onChange={handleStylesChange.bind(this, 'padding-bottom')}/>
							</FormItem>
				      	</Form>
				  	</Col>

			  	</Row>

		    	<Row>

				  	<Col span={12} style={{paddingRight: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['padding']['padding-left'] == '' ? <span>左内边距</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('padding-left') }} onConfirm={() => { setThisPropertyNull('padding-left') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['padding-left'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">左内边距</a>
										</Popconfirm>
								)
							}>
								<Input
									type="number"
									addonAfter={unitAfter(activeCSSUnitList['padding-left'].unit, 'padding-left')}
								 	size="small" value={activeCSSStyleState['padding']['padding-left']} onChange={handleStylesChange.bind(this, 'padding-left')}/>
							</FormItem>
				      	</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['padding']['padding-right'] == '' ? <span>右内边距</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('padding-right') }} onConfirm={() => { setThisPropertyNull('padding-right') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['padding-right'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">右内边距</a>
										</Popconfirm>
								)
							}>
								<Input
									type="number"
									addonAfter={unitAfter(activeCSSUnitList['padding-right'].unit, 'padding-right')}
									size="small" value={activeCSSStyleState['padding']['padding-right']} onChange={handleStylesChange.bind(this, 'padding-right')}/>
							</FormItem>
				      	</Form>
				  	</Col>

			  	</Row>

		      	<li className="ant-dropdown-menu-item-divider"></li>

		      	<Form className="form-no-margin-bottom zindex-form">
					<FormItem {...formItemLayout} label="居中">
						<Switch onChange={setMarginCenter} value={activeCSSStyleState['margin']['center']} size="small" />
					</FormItem>
		      	</Form>

		    	<Row hidden={activeCSSStyleState['margin']['margin-center']}>

				  	<Col span={12} style={{paddingRight: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['margin']['margin-top'] == '' ? <span>上外边距</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('margin-top') }} onConfirm={() => { setThisPropertyNull('margin-top') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['margin-top'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">上外边距</a>
										</Popconfirm>
								)
							}>
								<Input
									type="number"
									addonAfter={unitAfter(activeCSSUnitList['margin-top'].unit, 'margin-top')}
									size="small" value={activeCSSStyleState['margin']['margin-top']} onChange={handleStylesChange.bind(this, 'margin-top')}/>
							</FormItem>
				      	</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['margin']['margin-bottom'] == '' ? <span>下外边距</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('margin-bottom') }} onConfirm={() => { setThisPropertyNull('margin-bottom') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['margin-bottom'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">下外边距</a>
										</Popconfirm>
								)
							}>
								<Input
									type="number"
									addonAfter={unitAfter(activeCSSUnitList['margin-bottom'].unit, 'margin-bottom')}
								 	size="small" value={activeCSSStyleState['margin']['margin-bottom']} onChange={handleStylesChange.bind(this, 'margin-bottom')}/>
							</FormItem>
				      	</Form>
				  	</Col>

			  	</Row>

		    	<Row hidden={activeCSSStyleState['margin']['margin-center']}>

				  	<Col span={12} style={{paddingRight: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['margin']['margin-left'] == '' ? <span>左外边距</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('margin-left') }} onConfirm={() => { setThisPropertyNull('margin-left') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['margin-left'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">左外边距</a>
										</Popconfirm>
								)
							}>
								<Input
									type="number"
									addonAfter={unitAfter(activeCSSUnitList['margin-left'].unit, 'margin-left')}
									size="small" value={activeCSSStyleState['margin']['margin-left']} onChange={handleStylesChange.bind(this, 'margin-left')}/>
							</FormItem>
				      	</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['margin']['margin-right'] == '' ? <span>右外边距</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('margin-right') }} onConfirm={() => { setThisPropertyNull('margin-right') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['margin-right'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">右外边距</a>
										</Popconfirm>
								)
							}>
								<Input
									type="number"
									addonAfter={unitAfter(activeCSSUnitList['margin-right'].unit, 'margin-right')}
									size="small" value={activeCSSStyleState['margin']['margin-right']} onChange={handleStylesChange.bind(this, 'margin-right')}/>
							</FormItem>
				      	</Form>
				  	</Col>

			  	</Row>

		      	<li className="ant-dropdown-menu-item-divider"></li>

		    	<Row>

				  	<Col span={12} style={{paddingRight: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['width'] == '' ? <span>宽度</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('width') }} onConfirm={() => { setThisPropertyNull('width') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['width'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">宽度</a>
										</Popconfirm>
								)
							}>
								<Input
									type="number"
									addonAfter={unitAfter(activeCSSUnitList['width'].unit, 'width')}
								 	size="small" value={activeCSSStyleState['width']} onChange={handleStylesChange.bind(this, 'width')}/>
							</FormItem>
				      	</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['height'] == '' ? <span>高度</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('height') }} onConfirm={() => { setThisPropertyNull('height') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['height'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">高度</a>
										</Popconfirm>
								)
							}>
								<Input
									type="number"
									addonAfter={unitAfter(activeCSSUnitList['height'].unit, 'height')}
								 	size="small" value={activeCSSStyleState['height']} onChange={handleStylesChange.bind(this, 'height')}/>
							</FormItem>
				      	</Form>
				  	</Col>

			  	</Row>

		    	<Row>

				  	<Col span={12} style={{paddingRight: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['max-width'] == '' ? <span>最大</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('max-width') }} onConfirm={() => { setThisPropertyNull('max-width') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['max-width'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">最大</a>
										</Popconfirm>
								)
							}>
								<Input
									type="number"
									addonAfter={unitAfter(activeCSSUnitList['max-width'].unit, 'max-width')}
									size="small" value={activeCSSStyleState['max-width']} onChange={handleStylesChange.bind(this, 'max-width')}/>
							</FormItem>
				      	</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['min-width'] == '' ? <span>最小</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('min-width') }} onConfirm={() => { setThisPropertyNull('min-width') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['min-width'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">最小</a>
										</Popconfirm>
								)
							}>
								<Input
									type="number"
									addonAfter={unitAfter(activeCSSUnitList['min-width'].unit, 'min-width')}
									size="small" value={activeCSSStyleState['min-width']} onChange={handleStylesChange.bind(this, 'min-width')}/>
							</FormItem>
				      	</Form>
				  	</Col>

			  	</Row>

		    	<Row>

				  	<Col span={12} style={{paddingRight: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['max-height'] == '' ? <span>最大</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('max-height') }} onConfirm={() => { setThisPropertyNull('max-height') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['max-height'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">最大</a>
										</Popconfirm>
								)
							}>
								<Input
									type="number"
									addonAfter={unitAfter(activeCSSUnitList['max-height'].unit, 'max-height')}
									size="small" value={activeCSSStyleState['max-height']} onChange={handleStylesChange.bind(this, 'max-height')}/>
							</FormItem>
				      	</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['min-height'] == '' ? <span>最小</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('min-height') }} onConfirm={() => { setThisPropertyNull('min-height') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['min-height'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">最小</a>
										</Popconfirm>
								)
							}>
								<Input
									type="number"
									addonAfter={unitAfter(activeCSSUnitList['min-height'].unit, 'min-height')}
									size="small" value={activeCSSStyleState['min-height']} onChange={handleStylesChange.bind(this, 'min-height')}/>
							</FormItem>
				      	</Form>
				  	</Col>

			  	</Row>

		      	<li className="ant-dropdown-menu-item-divider"></li>

		      	<Form className="form-no-margin-bottom">
					<FormItem {...formItemLayout} label={
								activeCSSStyleState['float'] == '' ? <span>浮动</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('float') }} onConfirm={() => { setThisPropertyNull('float') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['float'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">浮动</a>
										</Popconfirm>
								)
							}>
				        <RadioGroup defaultValue="block" size="small" value={activeCSSStyleState['float']} onChange={handleStylesChange.bind(this, 'float')}>
					      	<RadioButton value="none">
		  		              	<Tooltip placement="top" title="无">
									<Icon type="close" />
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="left">
		  		              	<Tooltip placement="top" title="向左">
									<Icon type="menu-fold" />
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="right">
		  		              	<Tooltip placement="top" title="向右">
									<Icon type="menu-unfold" />
								</Tooltip>
					      	</RadioButton>
					    </RadioGroup>
					</FormItem>
		      	</Form>

		      	<Form className="form-no-margin-bottom">
					<FormItem {...formItemLayout} label={
								activeCSSStyleState['clear'] == '' ? <span>清除</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('clear') }} onConfirm={() => { setThisPropertyNull('clear') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['clear'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">清除</a>
										</Popconfirm>
								)
							}>
				        <RadioGroup defaultValue="block" value={activeCSSStyleState['clear']} size="small" onChange={handleStylesChange.bind(this, 'clear')}>
					      	<RadioButton value="none">
		  		              	<Tooltip placement="top" title="无">
									<Icon type="close" />
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="left">
		  		              	<Tooltip placement="top" title="左">
									<Icon type="fast-backward" />
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="right">
		  		              	<Tooltip placement="top" title="右">
									<Icon type="fast-forward" />
								</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="both">
		  		              	<Tooltip placement="top" title="全部">
									<Icon type="swap" />
								</Tooltip>
					      	</RadioButton>
					    </RadioGroup>
					</FormItem>
		      	</Form>

		      	<li className="ant-dropdown-menu-item-divider"></li>

		      	<Form className="form-no-margin-bottom">
					<FormItem {...formItemLayout} label={
								activeCSSStyleState['overflow'] == '' ? <span>溢出</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('overflow') }} onConfirm={() => { setThisPropertyNull('overflow') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['overflow'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">溢出</a>
										</Popconfirm>
								)
							}>
				        <RadioGroup defaultValue="block" value={activeCSSStyleState['overflow']} size="small" onChange={handleStylesChange.bind(this, 'overflow')}>
					      	<RadioButton value="visible">
		  		              	<Tooltip placement="top" title="可见">
									<Icon type="smile-o" />
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="hidden">
		  		              	<Tooltip placement="top" title="隐藏">
									<Icon type="frown-o" />
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="scroll">
		  		              	<Tooltip placement="top" title="滚动">
		  		              		<span>滚动</span>
								</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="auto">
		  		              	<Tooltip placement="top" title="自动">
		  		              		<span>自动</span>
								</Tooltip>
					      	</RadioButton>
					    </RadioGroup>
					</FormItem>
		      	</Form>

		      	<li className="ant-dropdown-menu-item-divider"></li>

		      	<Form className="form-no-margin-bottom">
					<FormItem {...formItemLayout} label={
								activeCSSStyleState['position'] == '' ? <span>位置</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('position') }} onConfirm={() => { setThisPropertyNull('position') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['position'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">位置</a>
										</Popconfirm>
								)
							}>
				        <RadioGroup defaultValue="block" value={activeCSSStyleState['position']} size="small" onChange={handleStylesChange.bind(this, 'position')}>
					      	<RadioButton value="auto">
		  		              	<Tooltip placement="top" title="自动">
									<Icon type="check" />
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="relative">
		  		              	<Tooltip placement="top" title="相对">
									<Icon type="shrink" />
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="absolute">
		  		              	<Tooltip placement="top" title="绝对">
		  		              		<span>绝对</span>
								</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="fixed">
		  		              	<Tooltip placement="top" title="固定">
		  		              		<span>固定</span>
								</Tooltip>
					      	</RadioButton>
					    </RadioGroup>
					</FormItem>
		      	</Form>

		      	<li className="ant-dropdown-menu-item-divider"></li>

		    	<Row>

				  	<Col span={12} style={{paddingRight: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['top'] == '' ? <span>顶边</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('top') }} onConfirm={() => { setThisPropertyNull('top') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['top'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">顶边</a>
										</Popconfirm>
								)
							}>
								<Input
									type="number"
									addonAfter={unitAfter(activeCSSUnitList['top'].unit, 'top')}
									size="small" value={activeCSSStyleState['top']} onChange={handleStylesChange.bind(this, 'top')}/>
							</FormItem>
				      	</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['left'] == '' ? <span>左边</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('left') }} onConfirm={() => { setThisPropertyNull('left') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['left'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">左边</a>
										</Popconfirm>
								)
							}>
								<Input
									type="number"
									addonAfter={unitAfter(activeCSSUnitList['left'].unit, 'left')}
								 	size="small" value={activeCSSStyleState['left']} onChange={handleStylesChange.bind(this, 'left')}/>
							</FormItem>
				      	</Form>
				  	</Col>

			  	</Row>

		      	<li className="ant-dropdown-menu-item-divider"></li>

		    	<Row>

				  	<Col span={12} style={{paddingRight: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['bottom'] == '' ? <span>底边</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('bottom') }} onConfirm={() => { setThisPropertyNull('bottom') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['bottom'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">底边</a>
										</Popconfirm>
								)
							}>
								<Input
									type="number"
									addonAfter={unitAfter(activeCSSUnitList['bottom'].unit, 'bottom')}
									size="small" value={activeCSSStyleState['bottom']} onChange={handleStylesChange.bind(this, 'bottom')}/>
							</FormItem>
				      	</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['right'] == '' ? <span>右边</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('right') }} onConfirm={() => { setThisPropertyNull('right') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['right'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">右边</a>
										</Popconfirm>
								)
							}>
								<Input
									type="number"
									addonAfter={unitAfter(activeCSSUnitList['right'].unit, 'right')}
								 	size="small" value={activeCSSStyleState['right']} onChange={handleStylesChange.bind(this, 'right')}/>
							</FormItem>
				      	</Form>
				  	</Col>

			  	</Row>

		      	<li className="ant-dropdown-menu-item-divider"></li>


		      	<Form className="form-no-margin-bottom zindex-form">
					<FormItem {...formItemLayout} label={
						activeCSSStyleState['z-index'] == '' ? <span>堆叠顺序</span> : (
						  	<Popconfirm onCancel={() => { setThisPropertyImportant('z-index') }} onConfirm={() => { setThisPropertyNull('z-index') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['z-index'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
									<a href="#">堆叠顺序</a>
								</Popconfirm>
						)
					}>
						<Input
							type="number"
							max={65535}
							min={-65535}
						 	size="small" value={activeCSSStyleState['z-index']} onChange={handleStylesChange.bind(this, 'z-index')}/>
					</FormItem>
		      	</Form>

		    </Panel>
		);
		}

		const typoPanel = () => {

			const fonts = ['Georgia', 'Impact', 'Verdana', 'Trebuchet MS', '微软雅黑', 
							'宋体', '黑体', 'Arial', 'Arial Black', 'Arial Narrow', 'Comic Sans MS', 'Tahoma', 
							'Time News Roman', 'Courier', 'Courier New', 
							'Hei', 'Monaco', 'simhei', 'MingLiU', 'PMingLiU', 'MS UI Gothic', 'Lucida Sans Unicode', 
							'Lucida Console', 'Garamond', 'MS Sans Serif', 'MS Serif', 'Palatino Linotype', 'Symbol',
							'Bookman Old Style'];
			const generatFontOption = (fonts) => {
				return fonts.map((font) => ((<Option key={font} value={font}>{font}</Option>)));
			}


			return (
		    <Panel header="字体" key="typo">
		    	<Row>

				  	<Col span={12} style={{paddingRight: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['font-family'] == '' ? <span>字体</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('font-family') }} onConfirm={() => { setThisPropertyNull('font-family') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['font-family'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">字体</a>
										</Popconfirm>
								)
							}>
	        				    <Select size="small" value="选择字体" value={activeCSSStyleState['font-family']} onChange={handleStylesChange.bind(this, 'font-family')}>
					      			{generatFontOption(fonts)}
					    		</Select>
							</FormItem>
				      	</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['color'] == '' ? <span>颜色</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('color') }} onConfirm={() => { setThisPropertyNull('color') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['color'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">颜色</a>
										</Popconfirm>
								)
							}>
								<ColorPicker onChangeComplete={handleStylesChange.bind(this, 'color')} color={activeCSSStyleState['color']} placement='left'/>
							</FormItem>
						</Form>
				  	</Col>

		    	</Row>

		    	<Row>

				  	<Col span={12} style={{paddingRight: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['font-weight'] == '' ? <span>粗细</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('font-weight') }} onConfirm={() => { setThisPropertyNull('font-weight') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['font-weight'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">粗细</a>
										</Popconfirm>
								)
							}>
	        				    <Select size="small" value="选择" value={activeCSSStyleState['font-weight']} onChange={handleStylesChange.bind(this, 'font-weight')}>
					      			<Option key="100" value="100">100 - 极细</Option>
					      			<Option key="200" value="200">200 - 稍细</Option>
					      			<Option key="300" value="300">300 - 细</Option>
					      			<Option key="400" value="400">400 - 正常</Option>
					      			<Option key="400" value="500">500 - 中等</Option>
					      			<Option key="400" value="700">700 - 粗</Option>
					      			<Option key="400" value="800">800 - 稍粗</Option>
					      			<Option key="400" value="900">900 - 极粗</Option>
					    		</Select>
							</FormItem>
						</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['font-style'] == '' ? <span>样式</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('font-style') }} onConfirm={() => { setThisPropertyNull('font-style') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['font-style'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">样式</a>
										</Popconfirm>
								)
							}>

								<RadioGroup defaultValue="normal" value={activeCSSStyleState['font-style']} size="small" onChange={handleStylesChange.bind(this, 'font-style')}>
							      	<RadioButton value="normal">
				  		              	<Tooltip placement="top" title="无">
											<i className="fa fa-font"></i>
							      		</Tooltip>
						      		</RadioButton>
							      	<RadioButton value="italic">
				  		              	<Tooltip placement="top" title="斜体">
											<i className="fa fa-italic"></i>
							      		</Tooltip>
							      	</RadioButton>
							    </RadioGroup>

							</FormItem>
				      	</Form>
				  	</Col>

			  	</Row>

		    	<Row>

				  	<Col span={12} style={{paddingRight: '5px'}}>
					  	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['text-indent'] == '' ? <span>缩进</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('text-indent') }} onConfirm={() => { setThisPropertyNull('text-indent') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['text-indent'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">缩进</a>
										</Popconfirm>
								)
							}>
								<Input type="text" size="small" value={activeCSSStyleState['text-indent']} onChange={handleStylesChange.bind(this, 'text-indent')}/>
							</FormItem>
					  	</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem style={{marginTop: '6px'}} {...formItemLayout} label={
								activeCSSStyleState['font-size'] == '' ? <span>大小</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('font-size') }} onConfirm={() => { setThisPropertyNull('font-size') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['font-size'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">大小</a>
										</Popconfirm>
								)
							}>
								<Input
									addonAfter={unitAfter(activeCSSUnitList['font-size'].unit, 'font-size')}
								 	type="text" size="small" value={activeCSSStyleState['font-size']} onChange={handleStylesChange.bind(this, 'font-size')}/>
							</FormItem>
				      	</Form>
				  	</Col>

		    	</Row>

		    	<Row>

				  	<Col span={12} style={{paddingRight: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['line-height'] == '' ? <span>行间距</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('line-height') }} onConfirm={() => { setThisPropertyNull('line-height') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['line-height'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">行间距</a>
										</Popconfirm>
								)
							}>
								<Input type="text" size="small" value={activeCSSStyleState['line-height']} onChange={handleStylesChange.bind(this, 'line-height')}/>
							</FormItem>
						</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem style={{marginTop: 4}} {...formItemLayout} label={
								activeCSSStyleState['letter-spacing'] == '' ? <span>词间距</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('letter-spacing') }} onConfirm={() => { setThisPropertyNull('letter-spacing') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['letter-spacing'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">词间距</a>
										</Popconfirm>
								)
							}>
								<Input
									addonAfter={unitAfter(activeCSSUnitList['letter-spacing'].unit, 'letter-spacing')}
									type="text" size="small" value={activeCSSStyleState['letter-spacing']} onChange={handleStylesChange.bind(this, 'letter-spacing')}/>
							</FormItem>
				      	</Form>
				  	</Col>

			  	</Row>

		      	<li className="ant-dropdown-menu-item-divider"></li>

		      	<Form className="form-no-margin-bottom">

					<FormItem {...formItemLayout} label={
								activeCSSStyleState['text-align'] == '' ? <span>排列方式</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('text-align') }} onConfirm={() => { setThisPropertyNull('text-align') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['text-align'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">排列方式</a>
										</Popconfirm>
								)
							}>

						<RadioGroup defaultValue="left" size="small" value={activeCSSStyleState['text-align']} onChange={handleStylesChange.bind(this, 'text-align')}>
					      	<RadioButton value="left">
		  		              	<Tooltip placement="top" title="向左">
									<i className="fa fa-align-left"></i>
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="center">
		  		              	<Tooltip placement="top" title="居中">
									<i className="fa fa-align-center"></i>
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="right">
		  		              	<Tooltip placement="top" title="向右">
									<i className="fa fa-align-right"></i>
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="justify">
		  		              	<Tooltip placement="top" title="两端对齐">
									<i className="fa fa-align-justify"></i>
					      		</Tooltip>
					      	</RadioButton>
					    </RadioGroup>

					</FormItem>

					<FormItem {...formItemLayout} label={
								activeCSSStyleState['write-mode'] == '' ? <span>阅读顺序</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('write-mode') }} onConfirm={() => { setThisPropertyNull('write-mode') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['write-mode'].important? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">阅读顺序</a>
										</Popconfirm>
								)
							}>

						<RadioGroup defaultValue="left" size="small" value={activeCSSStyleState['write-mode']} onChange={handleStylesChange.bind(this, 'write-mode')}>
					      	<RadioButton value="lr-tb">
		  		              	<Tooltip placement="top" title="从左到右">
									<i className="fa fa-indent"></i>
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="tb-rl">
		  		              	<Tooltip placement="top" title="从右到左">
									<i style={{transform:'rotate(180deg)'}} className="fa fa-indent"></i>
					      		</Tooltip>
					      	</RadioButton>
					    </RadioGroup>

					</FormItem>

					<FormItem {...formItemLayout} label={
								activeCSSStyleState['text-decoration'] == '' ? <span>渲染</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('text-decoration') }} onConfirm={() => { setThisPropertyNull('text-decoration') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['text-decoration'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">渲染</a>
										</Popconfirm>
								)
							}>

						<RadioGroup defaultValue="none" size="small" value={activeCSSStyleState['text-decoration']} onChange={handleStylesChange.bind(this, 'text-decoration')}>
					      	<RadioButton value="none">
		  		              	<Tooltip placement="top" title="无">
									<Icon type="close" />
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="underline">
		  		              	<Tooltip placement="top" title="下划线">
									<i className="fa fa-underline"></i>
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="line-through">
		  		              	<Tooltip placement="top" title="中划线">
									<i className="fa fa-strikethrough"></i>
					      		</Tooltip>
					      	</RadioButton>
					    </RadioGroup>

					</FormItem>

					<FormItem {...formItemLayout} label={
								activeCSSStyleState['text-transform'] == '' ? <span>大小写</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('text-transform') }} onConfirm={() => { setThisPropertyNull('text-transform') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['text-transform'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">大小写</a>
										</Popconfirm>
								)
							}>

						<RadioGroup defaultValue="none" size="small" value={activeCSSStyleState['text-transform']} onChange={handleStylesChange.bind(this, 'text-transform')}>
					      	<RadioButton value="none">
		  		              	<Tooltip placement="top" title="无">
									<Icon type="close" />
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="uppercase">
		  		              	<Tooltip placement="top" title="大写">
		  		              		<span>TT</span>
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="capitalize">
		  		              	<Tooltip placement="top" title="首字母大写">
		  		              		<span>Tt</span>
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="lowercase">
		  		              	<Tooltip placement="top" title="小写">
		  		              		<span>tt</span>
					      		</Tooltip>
					      	</RadioButton>
					    </RadioGroup>

					</FormItem>

		      	</Form>

		    </Panel>
		);
		}

		const backgroundPanel = () => {

			const setBGAlpha = () => {
				handleStylesChange('background-color', 'background', {
					target: {
						value: 'transparent'
					}
				})
			}


			const handleVisibleChange = (visible) => {

				props.dispatch({
					type: 'vdstyles/showBackgroundStyleSettingPane',
					payload: visible
				});
			}

		 	return (
			    <Panel header="背景" key="background">

			    	<Form className="form-no-margin-bottom">

						<FormItem {...formItemLayout} label="图片">

									<Popover
							        	content={backgroundImageAndGradient.imageSetter()}
							        	title="图片处理"
							        	trigger="click"
							        	placement="left"
							        	visible={props.vdstyles.backgroundStyleSettingPane.visible}
							        	onVisibleChange={handleVisibleChange}
							        	overlayClassName="bg-img-popover"
							      	>
					  		              	<Button>
												<i className="fa fa-picture-o"></i>
								      		</Button>
							      	</Popover>
						</FormItem>

			    	</Form>

			    	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label={
								activeCSSStyleState['background']['background-color'] == '' ? <span>背景色</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('background-color') }} onCancel={() => { setThisPropertyImportant('background-color') }} onConfirm={() => { setThisPropertyNull('background-color') }} title="属性操作" okText="删除属性" cancelText={
								  		!activeCSSUnitList['background-color'].important ? <span>置!important</span> : <span>取消!important</span>
								  	}>
											<a href="#">背景色</a>
										</Popconfirm>
								)
							}>
							<Row>
								<Col span={12} style={{paddingRight: '10px', marginBottom:'5px'}}>
								<ColorPicker onChangeComplete={handleStylesChange.bind(this, 'background-color', 'background')} color={activeCSSStyleState['background']['background-color']} placement='left'/>
								</Col>
								<Col span={12}>
									<Button onClick={setBGAlpha} size="small" style={{paddingLeft: '10px', paddingRight: '10px', marginTop: '4px'}}>透明背景</Button>
								</Col>
							</Row>
						</FormItem>
			    	</Form>

			    </Panel>
			);
		}

		const bordersPanel = () => {

			var borderPosition = activeCSSStyleState['border']['border-position'];
			var borderRadiusPosition = activeCSSStyleState['border-radius']['border-radius-position']

			const handleBorderTypeChange = (position) => {
				handleStylesChange('border-position', {
					target: {
						value: position
					}
				});
			};

			const handleBorderInputChange = (propertyName, e) => {
				handleStylesChange(borderPosition + '-' + propertyName, {
					target: {
						value: e.target.value
					}
				});
			};

			const handleBorderRadiusPositionChange = (position) => {
				handleStylesChange('border-radius-position', {
					target: {
						value: position
					}
				});
			};

			const handleBorderRadiusInputChange = (propertyName, e) => {
				handleStylesChange(borderRadiusPosition + '-radius', {
					target: {
						value: e.target.value
					}
				});
			}

			return (
		    <Panel header="边框" key="borders">

				<Row>
					<Col span={8}>
						<Row style={{marginBottom: '5px'}}>
							<Col span={8}></Col>
							<Col span={8} style={{marginTop: '5px'}}>
								<Tooltip title="上边框">
									<Button onClick={handleBorderTypeChange.bind(this, 'border-top')} size="small"><i className="fa fa-window-maximize"></i></Button>
								</Tooltip>
							</Col>
							<Col span={8}></Col>
						</Row>
						<Row style={{marginBottom: '5px'}}>
							<Col span={8}>
								<Tooltip placement="left" title="左边框">
									<Button onClick={handleBorderTypeChange.bind(this, 'border-left')} style={{marginLeft: '-3px'}} size="small"><i className="fa fa-window-maximize" style={{transform: 'rotate(-90deg)'}}></i></Button>
								</Tooltip>
							</Col>
							<Col span={8}>
								<Tooltip title="全边框">
									<Button onClick={handleBorderTypeChange.bind(this, 'border')} style={{width: '31px'}} size="small"><i className="fa fa-square-o"></i></Button>
								</Tooltip>
							</Col>
							<Col span={8}>
								<Tooltip placement="right" title="右边框">
									<Button onClick={handleBorderTypeChange.bind(this, 'border-right')} size="small"><i className="fa fa-window-maximize" style={{transform: 'rotate(90deg)'}}></i></Button>
								</Tooltip>
							</Col>
						</Row>
						<Row>
							<Col span={8}></Col>
							<Col span={8}>
								<Tooltip placement="bottom" title="下边框">
									<Button onClick={handleBorderTypeChange.bind(this, 'border-bottom')} size="small"><i className="fa fa-window-maximize" style={{transform: 'rotate(180deg)'}}></i></Button>
								</Tooltip>
							</Col>
							<Col span={8}></Col>
						</Row>
					</Col>

					<Col span={16} style={{paddingLeft: '15px'}}>
				    	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['border'][borderPosition + '-width'] == '' ? <span>宽度</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant(borderPosition + '-width') }} onConfirm={() => { setThisPropertyNull(borderPosition + '-width') }}title="属性操作" okText="删除属性" cancelText={
								  		!activeCSSUnitList[borderPosition + '-width'].important ? <span>置!important</span> : <span>取消!important</span>
								  	}>
											<a href="#">宽度</a>
										</Popconfirm>
								)
							}>
								<Input
									type="number"
									addonAfter={unitAfter(activeCSSUnitList[borderPosition + '-width'].unit, borderPosition + '-width')}
								 	size="small" value={activeCSSStyleState['border'][borderPosition + '-width']} onChange={handleBorderInputChange.bind(this, 'width')}/>
							</FormItem>

							<FormItem {...formItemLayout} label={
								activeCSSStyleState['border'][borderPosition + '-color'] == '' ? <span>颜色</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant(borderPosition + '-color') }} onConfirm={() => { setThisPropertyNull(borderPosition + '-color') }} title="属性操作" okText="删除属性" cancelText={
								  		!activeCSSUnitList[borderPosition + '-color'].important ? <span>置!important</span> : <span>取消!important</span>
								  	}>
											<a href="#">颜色</a>
										</Popconfirm>
								)
							}>
								<ColorPicker onChangeComplete={handleBorderInputChange.bind(this, 'color')} color={activeCSSStyleState['border'][borderPosition + '-color']} placement='left'/>
							</FormItem>
				    	</Form>
					</Col>
				</Row>

		    	<Form className="form-no-margin-bottom">

					<FormItem {...formItemLayout} label={
								activeCSSStyleState['border'][borderPosition + '-style'] == '' ? <span>样式</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant(borderPosition + '-style') }} onConfirm={() => { setThisPropertyNull(borderPosition + '-style') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList[borderPosition + '-style'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">样式</a>
										</Popconfirm>
								)
							}>

						<RadioGroup defaultValue="none" size="small" value={activeCSSStyleState['border'][borderPosition + '-style']} onChange={handleBorderInputChange.bind(this, 'style')}>
					      	<RadioButton value="none">
		  		              	<Tooltip placement="top" title="无">
									<Icon type="close" />
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="solid">
		  		              	<Tooltip placement="top" title="直线">
									<Icon type="minus" />
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="dashed">
		  		              	<Tooltip placement="top" title="虚线">
									<i className="fa fa-ellipsis-h"></i>
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="dotted">
		  		              	<Tooltip placement="top" title="点线">
									<Icon type="ellipsis" />
					      		</Tooltip>
					      	</RadioButton>
					    </RadioGroup>

					</FormItem>

		    	</Form>

		      	<li style={{marginTop: '15px', marginBottom: '15px'}} className="ant-dropdown-menu-item-divider"></li>

				<Row>
					<Col span={8}>
						<Row style={{marginBottom: '5px'}}>
							<Col span={8}>
								<Tooltip placement="top" title="弧 - 左上">
									<Button onClick={handleBorderRadiusPositionChange.bind(this, 'border-top-left')} style={{borderTopLeftRadius: '28px', width: '28px', height: '28px', marginBottom: '1px', marginLeft: '-2px'}} size="small"><i style={{position: 'relative', top: '3px', left: '2px'}} className="fa fa-window-maximize"></i></Button>
								</Tooltip>
								<Tooltip placement="bottom" title="弧 - 左下">
									<Button onClick={handleBorderRadiusPositionChange.bind(this, 'border-bottom-left')} style={{borderBottomLeftRadius: '28px', width: '28px', height: '28px', marginTop: '1px', marginLeft: '-2px'}} size="small"><i style={{position: 'relative', top: '-3px', left: '2px'}} className="fa fa-window-maximize"></i></Button>
								</Tooltip>
							</Col>
							<Col span={8}>
								<Button onClick={handleBorderRadiusPositionChange.bind(this, 'border')} style={{marginTop: '17px', marginRight: '1px'}} size="small"><i className="fa fa-window-maximize"></i></Button>
							</Col>
							<Col span={8}>
								<Tooltip placement="top" title="弧 - 右上">
									<Button onClick={handleBorderRadiusPositionChange.bind(this, 'border-top-right')} style={{borderTopRightRadius: '28px', width: '28px', height: '28px', marginBottom: '1px', marginLeft: '3px'}} size="small"><i style={{position: 'relative', top: '3px', left: '-2px'}} className="fa fa-window-maximize"></i></Button>
								</Tooltip>
								<Tooltip placement="bottom" title="弧 - 右下">
									<Button onClick={handleBorderRadiusPositionChange.bind(this, 'border-bottom-right')} style={{borderBottomRightRadius: '28px', width: '28px', height: '28px', marginTop: '1px', marginLeft: '3px'}} size="small"><i style={{position: 'relative', top: '-3px', left: '-2px'}} className="fa fa-window-maximize"></i></Button>
								</Tooltip>
							</Col>
						</Row>
					</Col>

					<Col span={16} style={{paddingLeft: '15px', marginTop: '12px'}}>
				    	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['border-radius'][borderRadiusPosition + '-radius'] == '' ? <span>弧度</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant(borderRadiusPosition + '-radius') }} onConfirm={() => { setThisPropertyNull(borderRadiusPosition + '-radius') }} title="属性操作" okText="删除属性" 
								  	cancelText={!activeCSSUnitList[borderRadiusPosition + '-radius'].important ? <span>置!important</span> : <span>取消!important</span>}>
											<a href="#">弧度</a>
										</Popconfirm>
								)
							}>
								<Input
									addonAfter={unitAfter(activeCSSUnitList[borderRadiusPosition + '-radius'].unit, borderRadiusPosition + '-radius')}
									value={activeCSSStyleState['border-radius'][borderRadiusPosition + '-radius']} size="small" onChange={handleBorderRadiusInputChange.bind(this, 'radius')} />
							</FormItem>
				    	</Form>
					</Col>
				</Row>

		    </Panel>);
		}

		const shadowsPanel = () => {

			const onVisibleChange = (cssPropertyIndex, shadowType, visible) => {

				
				if(visible) {
					props.dispatch({
						type: 'vdstyles/setActiveBoxShadow',
						payload: {
							cssPropertyIndex,
							shadowType,
							activeStyle: props.vdCtrlTree.activeCtrl.activeStyle
						}
					});
				}

				if (shadowType == 'text-shadow') {

					if(!visible) {
						setTimeout(() => {
							if (props.vdstyles.colorPickerPanel.visible) {
								return;
							}
							props.dispatch({
								type: 'vdstyles/editTextShadowPropsOnVisibleChange',
								payload: visible
							})
						}, 500)
					}else {
						props.dispatch({
							type: 'vdstyles/editTextShadowPropsOnVisibleChange',
							payload: visible
						})
					}
					
				}
			}

			const removeThisShadow = (cssPropertyIndex, shadowType) => {
				props.dispatch({
					type: 'vdstyles/removeThisShadow',
					payload: {
						cssPropertyIndex,
						shadowType,
						activeStyle: props.vdCtrlTree.activeCtrl.activeStyle
					}
				});

				props.dispatch({
					type: 'vdstyles/applyCSSStyleIntoPage',
					payload: {
						activeCtrl: props.vdCtrlTree.activeCtrl
					}
				});
			}

			const editShadowPropsOnVisibleChange = (visible) => {
				if(!visible) {
					setTimeout(() => {
						if (props.vdstyles.colorPickerPanel.visible) {
							return;
						}
						props.dispatch({
							type: 'vdstyles/editShadowPropsOnVisibleChange',
							payload: visible
						})
					}, 500)
				}else {
					props.dispatch({
						type: 'vdstyles/editShadowPropsOnVisibleChange',
						payload: visible
					})
				}
				
			}


			return (<Panel header="阴影" key="shadows">
		    	<Form className="form-no-margin-bottom">
					<FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={{textAlign: 'right'}} label="盒子阴影">

		      			<Tooltip placement="top" title="添加盒子阴影">
		      				<Popover title='添加盒子阴影' trigger="click" placement="leftTop" visible={props.vdstyles.boxShadowPane.visible} onVisibleChange={changeBoxShadowPaneVisible} content={shadowProps.settingPopover(this)}>
								<Button size="small"><Icon type="plus" /></Button>
				      		</Popover>
			      		</Tooltip>

					</FormItem>
					<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -5}}>
						{
							activeCSSStyleState['box-shadow'].childrenProps.map((cssProperty, cssPropertyIndex) => {
								return (

										<div key={cssPropertyIndex}  style={{border: '1px solid #d9d9d9', minHeight: 10, marginTop: '10px'}}>
											<Row>
												<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
													<div className="color-preview-tag-style" style={{background:cssProperty.color}}></div>
												</Col>
												<Col span={12} style={{textAlign: 'center', cursor: 'pointer'}}>
													<span>{cssProperty['inset']}</span>
												</Col>
												<Popover key={cssPropertyIndex} placement="left" title="编辑盒子阴影"
														content={shadowProps.modifyPopover()}
														trigger="click"
														onVisibleChange={editShadowPropsOnVisibleChange}
														visible={props.vdstyles.boxShadowEditorPane.visible}
														>
													<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
														<i onClick={onVisibleChange.bind(this, cssPropertyIndex, 'box-shadow')} className="fa fa-edit"></i>
													</Col>
												</Popover>

												<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
													<i onClick={removeThisShadow.bind(this, cssPropertyIndex, 'box-shadow')} className="fa fa-trash-o"></i>
												</Col>
											</Row>
										</div>

								);
							})
						}
					</FormItem>

		    	</Form>

		    	<li style={{marginTop: '15px', marginBottom: '15px'}} className="ant-dropdown-menu-item-divider"></li>

		    	<Form className="form-no-margin-bottom">
					<FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={{textAlign: 'right'}} label="文字阴影">

		      			<Tooltip placement="top" title="添加文字阴影">
		      				<Popover title='添加文字阴影' placement="leftTop" visible={props.vdstyles.textShadowPane.visible} onVisibleChange={changeTextShadowPaneVisible} content={textShadowProps.settingPopover()} trigger="click">
								<Button size="small"><Icon type="plus" /></Button>
				      		</Popover>
			      		</Tooltip>

					</FormItem>
					<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -5}}>
						{
							activeCSSStyleState['text-shadow'].childrenProps.map((cssProperty, cssPropertyIndex) => {

								return (
							      	<Popover visible={props.vdstyles.textShadowEditorPane.visible} onVisibleChange={onVisibleChange.bind(this, cssPropertyIndex, 'text-shadow')} key={cssPropertyIndex} placement="left" title="编辑文字阴影" content={textShadowProps.modifyPopover()} trigger="click">

										<div key={cssPropertyIndex} style={{border: '1px solid #d9d9d9', minHeight: 10, marginTop: '10px'}}>
											<Row>
												<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
													<div className="color-preview-tag-style" style={{background:cssProperty.color}}></div>
												</Col>
												<Col span={16} style={{textAlign: 'center', cursor: 'pointer'}}>
													<span>{cssProperty['h-shadow']}px,{cssProperty['v-shadow']}px</span>
												</Col>
												<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
													<i onClick={removeThisShadow.bind(this, cssPropertyIndex, 'text-shadow')} className="fa fa-trash-o"></i>
												</Col>
											</Row>
										</div>

							      	</Popover>
								);
							})
						}
					</FormItem>

		    	</Form>

		    </Panel>
		);
		}

		/*
			<Tooltip placement="top" title="变换设置">
					<Popover title='变换设置' placement="leftTop" trigger="click" content={transformAndTransitionProps.transitionSttingPopover}>
	      			<Button size="small" style={{textAlign: 'center'}}>
	      				<i className="fa fa-cog"></i>
	      			</Button>
	      		</Popover>
	  		</Tooltip>
		*/

		const transitionsTransformsPanel = () => {

			const removeThisTransition = (transitionIndex) => {
				props.dispatch({
					type: 'vdstyles/removeThisTransition',
					payload: {
						transitionIndex,
						activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
					}
				});

				props.dispatch({
					type: 'vdstyles/applyCSSStyleIntoPage',
					payload: {
						activeCtrl: props.vdCtrlTree.activeCtrl
					}
				});
			}

			const removeThisTransform = (transformIndex) => {
				props.dispatch({
					type: 'vdstyles/removeThisTransform',
					payload: {
						transformIndex,
						activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
					}
				});

				props.dispatch({
					type: 'vdstyles/applyCSSStyleIntoPage',
					payload: {
						activeCtrl: props.vdCtrlTree.activeCtrl
					}
				});
			}

		 	return (
			    <Panel header="过渡和变换" key="transitions-transforms">
			      	<Form className="form-no-margin-bottom">
			      		<FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={{textAlign: 'right', marginTop: 5, marginBottom: 6}} label="过渡">
			      			<Tooltip placement="top" title="添加过渡">
			      				<Popover title='添加过渡' trigger="click" placement="leftTop" onVisibleChange={changeNewTranstionPane} visible={props.vdstyles.popover.newTransition.visible} content={transformAndTransitionProps.transformSettingPopover()}>
					      			<Button size="small">
					      				<i className="fa fa-plus"></i>
					      			</Button>
					      		</Popover>
				      		</Tooltip>
			      		</FormItem>

			      		<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -5}}>
			      			{
			      				activeCSSStyleState['transition'].childrenProps.map((cssProperty, cssPropertyIndex) => {
			      					return (
										<div key={cssPropertyIndex} className="filter-list">
											<Row>
												<Col span={20} style={{textAlign: 'left', cursor: 'pointer', paddingLeft: '15px'}}>
													{cssProperty['transition-timing-function']}({cssProperty['transition-duration']},{cssProperty['transition-property']})
												</Col>
												<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
													<i onClick={removeThisTransition.bind(this, cssPropertyIndex)} className="fa fa-trash-o"></i>
												</Col>
											</Row>
										</div>
			      					);
			      				})
			      			}
						</FormItem>

						<li className="ant-dropdown-menu-item-divider"></li>

						<FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={{textAlign: 'right', marginTop: 5}} label="变换">
							<ButtonGroup size="small" style={{marginBottom: '6px'}}>
				      			<Tooltip placement="top" title="添加变换">
				      				<Popover trigger="click" visible={props.vdstyles.popover.newTransform.visible} title='添加变换' placement="left" onVisibleChange={changeNewTransformPane} content={transformAndTransitionProps.transitionAddPopover()}>
						      			<Button size="small" style={{textAlign: 'center'}}>
						      				<i className="fa fa-plus"></i>
						      			</Button>
						      		</Popover>
					      		</Tooltip>
							</ButtonGroup>
			      		</FormItem>

			      		<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -3}}>
			      			{
			      				activeCSSStyleState['transform'].childrenProps.map((cssProperty, cssPropertyIndex) => {
			      					return (
										<div key={cssPropertyIndex} className="filter-list">
											<Row>
												<Col span={20} style={{textAlign: 'left', cursor: 'pointer', paddingLeft: '15px'}}>
													{cssProperty.name}({cssProperty.value.join(',')})
												</Col>
												<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
													<i onClick={removeThisTransform.bind(this, cssPropertyIndex)} className="fa fa-trash-o"></i>
												</Col>
											</Row>
										</div>
			      					);
			      				})
			      			}
						</FormItem>

			      	</Form>
			    </Panel>
			);
		}

		const effectsPanel = () => {

			var activeFilter = activeCSSStyleState['filter'].state.activeFilter;

			const effectsProps = {
				newfilterEditor () {

					var filterProps = {
						onChange (value, option) {
							props.dispatch({
								type: 'vdstyles/handleFilterTypeChange',
								payload: {
									value,
									index: option.props.index,
									activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
								}
							});
						}
					}

					var filterFormGenerator = (cssProp) => {

						const handleFilterInputChange = (unit, e) => {
							props.dispatch({
								type: 'vdstyles/handleFilterInputChange',
								payload: {
									value: e.target.value,
									unit
								}
							});
						}

						var filter = {
							blur () {
								return (
			    					<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="高斯模糊" className='fa fa-clock-o'></i>)}>
										<Row>
									        <Col span={18} style={{paddingRight: '10px'}}>
									          	<Input type="number" onPressEnter={saveFilter} onChange={handleFilterInputChange.bind(this, 'px')} value={props.vdstyles.filterSetting.value} size="small"/>
									        </Col>
									        <Col span={4}>
									        	px
									        </Col>
									    </Row>
									</FormItem>
								);
							},

							brightness () {
								return (
					    			<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="亮度" className='fa fa-clock-o'></i>)}>
										<Row>
									        <Col span={18} style={{paddingRight: '10px'}}>
									          	<Input type="number" onPressEnter={saveFilter} onChange={handleFilterInputChange.bind(this, '%')} value={props.vdstyles.filterSetting.value} size="small"/>
									        </Col>
									        <Col span={4}>
									        	％
									        </Col>
									    </Row>
									</FormItem>
								);
							},

							contrast () {
								return (
					    			<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="对比度" className='fa fa-clock-o'></i>)}>
										<Row>
									        <Col span={18} style={{paddingRight: '10px'}}>
									          	<Input type="number" onPressEnter={saveFilter} onPressEnter={saveFilter} onChange={handleFilterInputChange.bind(this, '%')} value={props.vdstyles.filterSetting.value} size="small"/>
									        </Col>
									        <Col span={4}>
									        	％
									        </Col>
									    </Row>
									</FormItem>
								);
							},

							grayscale () {
								return (
					    			<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="灰度图像" className='fa fa-clock-o'></i>)}>
										<Row>
									        <Col span={18} style={{paddingRight: '10px'}}>
									          	<Input type="number" onPressEnter={saveFilter} onChange={handleFilterInputChange.bind(this, '%')} value={props.vdstyles.filterSetting.value} size="small"/>
									        </Col>
									        <Col span={4}>
									        	％
									        </Col>
									    </Row>
									</FormItem>
								);
							},

							'hue-rotate' () {
								return (
					    			<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="旋转" className='fa fa-clock-o'></i>)}>
										<Row>
									        <Col span={18} style={{paddingRight: '10px'}}>
									          	<Input type="number" onPressEnter={saveFilter} onChange={handleFilterInputChange.bind(this, 'deg')} value={props.vdstyles.filterSetting.value} size="small"/>
									        </Col>
									        <Col span={4}>
									        	deg
									        </Col>
									    </Row>
									</FormItem>
								);
							},

							invert () {
								return (
		    						<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="反转" className='fa fa-clock-o'></i>)}>
										<Row>
									        <Col span={18} style={{paddingRight: '10px'}}>
									          	<Input type="number" onPressEnter={saveFilter} onChange={handleFilterInputChange.bind(this, '%')} value={props.vdstyles.filterSetting.value} size="small"/>
									        </Col>
									        <Col span={4}>
									        	%
									        </Col>
									    </Row>
									</FormItem>
								);
							},

							saturate () {
								return (
					    			<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="饱和度" className='fa fa-clock-o'></i>)}>
										<Row>
									        <Col span={18} style={{paddingRight: '10px'}}>
									          	<Input type="number" onPressEnter={saveFilter} onChange={handleFilterInputChange.bind(this, '%')} value={props.vdstyles.filterSetting.value} size="small"/>
									        </Col>
									        <Col span={4}>
									        	%
									        </Col>
									    </Row>
									</FormItem>
								);
							},

							sepia () {
								return (
									<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="深褐色" className='fa fa-clock-o'></i>)}>
										<Row>
									        <Col span={18} style={{paddingRight: '10px'}}>
									          	<Input type="number" onPressEnter={saveFilter} onChange={handleFilterInputChange.bind(this, '%')} value={props.vdstyles.filterSetting.value} size="small"/>
									        </Col>
									        <Col span={4}>
									        	%
									        </Col>
									    </Row>
									</FormItem>
								);
							}

						}

						return filter[cssProp]();

					}

					const saveFilter = () => {
						props.dispatch({
							type: 'vdstyles/saveFilter',
							payload: {
								activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle,
								activeFilterName: activeCSSStyleState['filter'].filters[activeFilter].cssProp
							}
						});

						props.dispatch({
							type: 'vdstyles/applyCSSStyleIntoPage',
							payload: {
								activeCtrl: props.vdCtrlTree.activeCtrl
							}
						});

					}

					return (

			    		<Form>
			    			<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="属性" className='fa fa-search'></i>)}>
			    				<Select
			    					size="small"
			    					onSelect={filterProps.onChange}
			    				    showSearch
			    				    placeholder="选择滤镜"
			    				    optionFilterProp="children"
			    				    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
			    				    value={activeCSSStyleState['filter'].filters[activeFilter].cssProp}
			    				>
			    				{
			    					activeCSSStyleState['filter'].filters.map((filter, filterIndex) => {
			    						return (
				    				        <Option key={filter.cssProp} value={filter.cssProp}>{filter.name}</Option>
			    						);
			    					})
			    				}
			    				</Select>
			    			</FormItem>

			    			{filterFormGenerator(activeCSSStyleState['filter'].filters[activeFilter].cssProp)}

			    			<Button onClick={saveFilter} size="small">保存</Button>

			    		</Form>

					);

				}
			}

			const newFilterPopoverTrigger = () => {
				props.dispatch({
					type: 'vdstyles/togglePopover',
					payload: {
						popoverName: 'newFilter'
					}
				});
			}

			const removeThisFilter = (filterIndex) => {
				props.dispatch({
					type: 'vdstyles/removeThisFilter',
					payload: {
						filterIndex,
						activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
					}
				});

				props.dispatch({
					type: 'vdstyles/applyCSSStyleIntoPage',
					payload: {
						activeCtrl: props.vdCtrlTree.activeCtrl
					}
				});
			}

			return (
		    <Panel header="效果" key="effects">
		    	<Form className="form-no-margin-bottom">
  	    			<FormItem labelCol={{span: 6}} wrapperCol={{span: 16}} label={
								activeCSSStyleState['opacity'] == '' ? <span>透明度</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('opacity') }} onConfirm={() => { setThisPropertyNull('opacity') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['opacity'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">透明度</a>
										</Popconfirm>
								)
							}>
  						<Row>
  					        <Col span={15} style={{paddingRight: '10px'}}>
  					          	<Input
  					          	 	size="small" value={activeCSSStyleState['opacity']} onChange={handleStylesChange.bind(this, 'opacity')}/>
  					        </Col>
  					    </Row>
  					</FormItem>

  					<li className="ant-dropdown-menu-item-divider"></li>

  					<FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={{textAlign: 'right', marginTop: 5}} label="滤镜">
		      			<Tooltip placement="top" title="添加滤镜">
		      				<Popover trigger="click" onVisibleChange={newFilterPopoverTrigger} title='添加滤镜' placement="leftTop"  visible={props.vdstyles.popover.newFilter.visible} content={effectsProps.newfilterEditor()}>
				      			<Button size="small">
				      				<i className="fa fa-plus"></i>
				      			</Button>
				      		</Popover>
			      		</Tooltip>
		      		</FormItem>

		      		<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -5}}>
			      			{
			      				activeCSSStyleState['filter'].childrenProps.map((cssProperty, cssPropertyIndex) => {
			      					return (
											<div className="filter-list" key={cssPropertyIndex}>
												<Row>
													<Col span={20} style={{textAlign: 'left', cursor: 'pointer', paddingLeft: '15px'}}>
														{cssProperty.name}, {cssProperty.value}
													</Col>
													<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
														<i onClick={removeThisFilter.bind(this, cssPropertyIndex)} className="fa fa-trash-o"></i>
													</Col>
												</Row>
											</div>
			      					);
			      				})
			      			}
					</FormItem>

					<li className="ant-dropdown-menu-item-divider"></li>

					<FormItem style={{marginTop: 20}} labelCol={{span: 8}} wrapperCol={{span: 16}} label={
								activeCSSStyleState['cursor'] == '' ? <span>鼠标样式</span> : (
								  	<Popconfirm onCancel={() => { setThisPropertyImportant('cursor') }} onConfirm={() => { setThisPropertyNull('cursor') }} title="属性操作" okText="删除属性" cancelText={
								  					!activeCSSUnitList['cursor'].important ? <span>置!important</span> : <span>取消!important</span>
								  				}>
											<a href="#">鼠标样式</a>
										</Popconfirm>
								)
							}>
						<Input addonBefore={<Popover
    											content={effectProps.cursorPopover()}
									        	title="鼠标样式"
									        	trigger="click"
									        	placement="leftTop"
									        	visible={props.vdstyles.popover.cursor.visible}
									        >
    											<Icon onClick={() => { props.dispatch({type: 'vdstyles/togglePopover', payload: { popoverName: 'cursor' }}) }} type="setting"/>
    										</Popover>}
    							size="small"
 								onChange={handleStylesChange.bind(this, 'cursor')}
    							value={activeCSSStyleState['cursor']}
						/>
					</FormItem>

				</Form>
		    </Panel>
		);
		}

		var tipPanel = (
			<Card style={{ width: 'auto', margin: '15px', background: '#f7f7f7' }}>
			    <div>添加<Tag style={{marginLeft: '8px'}} color="#87d068"><span style={{color: 'rgb(255, 255, 255)'}}>类名</span></Tag>后可以调整以下属性：</div>
			    <ol>
			    	<li style={{margin:'2px'}}>1、<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>元素位置</span></Tag>和<Tag color="cyan" style={{marginLeft: '8px'}}><span style={{color: 'rgb(255, 255, 255)'}}>大小</span></Tag></li>
			    	<li style={{margin:'2px'}}>2、<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>字体</span></Tag>属性</li>
			    	<li style={{margin:'2px'}}>3、<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>背景</span></Tag>属性</li>
			    	<li style={{margin:'2px'}}>4、<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>边框</span></Tag>属性</li>
			    	<li style={{margin:'2px'}}>5、<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>阴影</span></Tag>属性</li>
			    	<li style={{margin:'2px'}}>6、<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>交互动画</span></Tag></li>
			    </ol>
			</Card>
		);

		var tpl = '',
			newCSSTpl = (

			<div>
				<Collapse bordered={false} defaultActiveKey={['css', 'layout', 'typo', 'background', 'borders', 'shadows', 'tt', 'effects']}>
					{cssPanel}
				</Collapse>
				{tipPanel}
			</div>
		);

		if(props.vdCtrlTree.activeCtrl.activeStyle) {

			if(!activeCSSStyleState) {
				tpl = newCSSTpl;
			}else {
				tpl = (
					<Collapse bordered={false} defaultActiveKey={['css', 'layout', 'typo', 'background', 'borders', 'shadows', 'transitions-transforms', 'effects']}>
						{cssPanel}
						{layoutPanel()}
						{typoPanel()}
						{backgroundPanel()}
						{bordersPanel()}
						{shadowsPanel()}
						{transitionsTransformsPanel()}
						{effectsPanel()}
					</Collapse>
				);
			}

		}else {
			tpl = newCSSTpl;
		}

		return tpl;

    }

  	return (
  		<div className="vdctrl-pane-wrapper">
  			{ props.vdCtrlTree.activeCtrl.tag && vdctrlCollapse() }
  		</div>
  	);

};


function mapSateToProps({ vdstyles, vdCtrlTree }) {
  return { vdstyles, vdCtrlTree };
}

export default connect(mapSateToProps)(VDStylePanel);

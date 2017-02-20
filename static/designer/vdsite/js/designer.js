$(function() {
	if (document.domain != 'localhost') {
		document.domain = 'gospely.com';
	}

	var jq = jQuery.noConflict();

	//是否是最后一个子元素
	jQuery.fn.isLastChild = function() {
		var next = this.next();
		
		// if (!next) {
		// 	return true;
		// }
		// if (next.attr("id") === "vdInsertGuide") {
		// 	return !next.next().attr("vdid");
		// }else {
			return !next.attr("vdid") && next.attr("id") !== "vdInsertGuide";
		// }
        
    };

    var guide = jq("#vdInsertGuide");
    var parentGuide = jq("#vdOutlineDropParentNode");

	//拖拽过程中的一些数据及函数
	var dndData = {
		//开始拖拽时生成的dom
		elemToAdd: '',

		//拖拽增加控件时生成的控件的数据
		ctrlToAddData: '',

		dragOverElem: '',
		dragElem: '',
		originalY: '',
		originalX: '',
		dragElemParent: '',


		//判断是否是合格子元素的方法
		isLegalChild: function (e, target) {

			if (guide.parent().data("specialChild")) {

				var specialChild = guide.parent().data("specialChild");
				var dragClass = dndData.dragElem[0].className;
				var dragTag = dndData.dragElem[0].tagName;

				if (dragClass.indexOf(specialChild.className) === -1 || specialChild.tag.indexOf(dragTag) === -1) {
					return false;
				}

				return true;
			}

			return true;

		},

		//是否是合格父元素
		isLegalParent: function (e, target) {
			if (dndData.dragElem.data("specialParent")) {

				var specialParent = dndData.dragElem.data("specialParent");
				var parentClass = guide.parent()[0].className;
				var parentTag = guide.parent()[0].tagName;

				console.log(specialParent, parentClass, parentTag)

				if (parentClass.indexOf(specialParent.className) === -1 || specialParent.tag.indexOf(parentTag) === -1) {
					return false;
				}

				return true;
			}

			return true;
		},

		//每次位置变动前的处理
		actionBeforeMove: function (e, target) {

			if (!(dndData.isMouseDown && guide.css("display") === 'none')) {
				dndData.dragElemParent = guide.parent();
			}
			
		},

		needShowParentGuide: function (e, target) {
			var parent = target.parent();
			if (parent.data("container")) {
				parentGuide.css({
					left: parent.offset().left,
					top: parent.offset().top,
					width: parent.outerWidth(),
					height: parent.outerHeight(),
					display: 'block'
				})
			}
		},

		//每次位置变动后的处理
		actionAfterMove: function (e, target) {
			
			if (dndData.dragElemParent.children() && dndData.dragElemParent.children().length === 0 || 
				dndData.isMouseDown && dndData.dragElemParent.children().length === 1) {
				dndData.needChangeClass.push({
					target: dndData.dragElemParent,
					className: 'vd-empty',
					type: 'add'
				})
			}

			if (guide.parent().children().length >= 2) {
				dndData.needChangeClass.push({
					target: guide.parent(),
					className: 'vd-empty',
					type: 'remove'
				})
			}

			if (dndData.dragElem.children().length >= 1) {
				dndData.needChangeClass.push({
					target: dndData.dragElem,
					className: 'vd-empty',
					type: 'remove'
				})
			}

			if (dndData.isLegalChild(e, target) && dndData.isLegalParent(e, target)) {
				guide.removeClass("error");
				parentGuide.removeClass("error");
			}else {
				guide.addClass("error");
				parentGuide.addClass("error");
			}
			
			dndData.originalX = e.pageX;
			dndData.originalY = e.pageY;
	        
		},

		needChangeClass: [],

		isMouseDown: false,

		verticalBefore: function (e, target, isContainerSpecial) {

			if (target.prev().attr("id") === "vdInsertGuide" && guide.css("display") !== "none") {
				return false;
			}

			dndData.actionBeforeMove(e, target);

			target.before(guide);

			dndData.needShowParentGuide(e, target);

			if (isContainerSpecial) {
				guide.css({
					width: target.parent().innerWidth(),
					height: 2,
					display: 'block',
					top: target.offset().top,
					position: 'fixed',
					left: 0
				})
			}else {
				guide.css({
					width: target.outerWidth(),
					height: 2,
					display: 'block',
					top: target.offset().top,
					position: 'fixed',
					left: 0
				})
			}
			
			dndData.actionAfterMove(e, target);
		},

		verticalAfter: function (e, target, isContainerSpecial) {

			if (target.next().attr("id") === "vdInsertGuide" && guide.css("display") !== "none") {
				return false;
			}

			dndData.actionBeforeMove(e, target);

			target.after(guide);
			dndData.needShowParentGuide(e, target);

			if (isContainerSpecial) {
				guide.css({
					width: target.parent().innerWidth(),
					display: 'block',
					height: 2,
					top: target.offset().top + target.outerHeight(),
					position: 'fixed',
					left: 0
				})
			}else {
				guide.css({
					width: target.outerWidth(),
					display: 'block',
					height: 2,
					top: target.offset().top + target.outerHeight(),
					position: 'fixed',
					left: 0
				})
			}

			
			dndData.actionAfterMove(e, target);
		},

		verticalAppend: function (e, target) {

			if (target.children().length) {
				if(target.children()[target.children().length - 1].id === 'vdInsertGuide' && guide.css("display") !== "none") {
					return false;
				}
			}

			dndData.actionBeforeMove(e, target);

			target.append(guide);

			guide.css({
				width: target.innerWidth(),
				display: 'block',
				height: 2,
				position: 'relative',
				top: 0,
				left: 0
			})

			parentGuide.css({
				left: target.offset().left,
				top: target.offset().top,
				width: target.outerWidth(),
				height: target.outerHeight(),
				display: 'block'
			})

			dndData.needChangeClass.push({
				className: 'vd-empty',
				target: target,
				type: 'remove'
			})

			dndData.actionAfterMove(e, target, 'append');
		},

        horizontalBefore: function (e, target) {

        	if (target.prev().attr("id") === "vdInsertGuide" && guide.css("display") !== "none") {
				return false;
			}

        	dndData.actionBeforeMove(e, target);

        	dndData.needShowParentGuide(e, target);
			target.before(guide);

			guide.css({
				width: 2,
				height: target.outerHeight(),
				display: 'block',
				top: target.offset().top,
				left: target.offset().left,
				position: 'fixed'
			})
			dndData.actionAfterMove(e, target);
        },

        horizontalAfter: function (e, target) {

        	if (target.next().attr("id") === "vdInsertGuide" && guide.css("display") !== "none") {
				return false;
			}

        	dndData.actionBeforeMove(e, target);

        	dndData.needShowParentGuide(e, target);
			target.after(guide);
			guide.css({
				width: 2,
				display: 'block',
				top: target.offset().top,
				left: target.offset().left + target.outerWidth(),
				position: 'fixed'
			})
			dndData.actionAfterMove(e, target);
        },

        horizontalAppend: function (e, target) {

        	if (target.children().length) {
				if(target.children()[target.children().length - 1].id === 'vdInsertGuide' && guide.css("display") !== "none") {
					return false;
				}
			}

        	dndData.actionBeforeMove(e, target);

			target.append(guide);
			guide.css({
				width: target.innerWidth(),
				display: 'block',
				height: 2,
				position: 'relative',
				top: 0,
				left: 0
			})

			parentGuide.css({
				left: target.offset().left,
				top: target.offset().top,
				width: target.outerWidth(),
				height: target.outerHeight(),
				display: 'block'
			})
			dndData.needChangeClass.push({
				className: 'vd-empty',
				target: target,
				type: 'remove'
			})

			dndData.actionAfterMove(e, target, 'append');
        },

        containerSpecialHandle: function (e, target) {
        	
        	if (dndData.dragElem.attr("vdid") === target.attr("vdid")) {
        		return false;
        	}

			let firAndLas = [];
			target.children().each(function () {
					
				if (e.pageY >= jq(this).offset().top && e.pageY <= jq(this).offset().top + jq(this).outerHeight()) {
					firAndLas.push(jq(this))
				}

			})
			
			let first = firAndLas[0],
				last = firAndLas[firAndLas.length - 1];

			if (first && last && first[0].id !== "vdInsertGuide") {
				let heigher = first.outerHeight();

				if (heigher < last.outerHeight()) {
					heigher = last.outerHeight()
				}

				let ref = (e.pageY - first.offset().top) / heigher;

				parentGuide.css({
					left: target.parent().offset().left,
					top: target.parent().offset().top,
					width: target.parent().outerWidth(),
					height: target.parent().outerHeight(),
					display: 'block'
				})
				
				if (ref > 0.5) {
					dndData.verticalAfter(e, last, true);
				}else if (ref <= 0.5) {
					dndData.verticalBefore(e, first, true);
				}
			}else {
				
				dndData.verticalAppend(e, target);	
			}
			
        }

	};

	var dndHandlder = function () {

		var parentWindow = window.parent;

		//点击组件
		jq(document).on("click", function (e) {
			e.stopPropagation();
			var targetData = jq(e.target).data('controller');
            if(!targetData) {
                controllerOperations.desSelect(targetData);
            }
		})

		//给父级发送消息
		var postMessageToFather = {
			ctrlClicked: function (c) {
				parentWindow.postMessage({ 'ctrlClicked': c }, "*");
			},

			pageSelected: function (c) {
				parentWindow.postMessage({ 'pageSelected': c }, "*");
			},

			generateCtrlTree: function(c) {
				parentWindow.postMessage({ 'generateCtrlTree': c }, "*");
			},

			elemAdded: function (c) {
				parentWindow.postMessage({ 'elemAdded': c }, "*");
			},

			ctrlSelected: function (c) {
				parentWindow.postMessage({ 'ctrlSelected': c }, "*");
			}
		};

		//监听父级消息
		var listenParentMessage = function() {

            var self = this;

            window.addEventListener('message', function(evt) {

                var data = evt.data;
                var eventName = '';

                var evtAction = {
                    ctrlTreeGenerated: function() {
                        var elem = new ElemGenerator(data.controller);
                        var elemToAdd = jq(elem.createElement());
                        dndData.elemToAdd = elemToAdd;
                        dndData.dragElem = elemToAdd;
                        dndData.ctrlToAddData = data.controller;
                    },

                    VDAttrRefreshed: function() {
                        controllerOperations.refreshCtrl(data.activeCtrl, data.attr, data.attrType);
                        controllerOperations.select(data.activeCtrl, true);
                    },

                    applyCSSIntoPage: function() {
                        pageOperations.applyCSS(data.cssText);
                        controllerOperations.select(data.activeCtrl, true);
                    }
                };

                for (var key in data) {
                    eventName = key;
                }

                if (evtAction[eventName]) {
                    data = data[key];
                    evtAction[eventName]();
                }

            });

        }();

		//对控件的一些操作
		var controllerOperations = {
			hideDesignerDraggerBorder: function () {
                jq('#vd-OutlineSelectedActiveNode').hide();
                jq('#vdInsertGuide').hide();
                jq('#vdOutlineDropParentNode').hide();
			},

			showDesignerDraggerBorder: function (target) {

                if(target.length === 0) {
                    return false;
                }

                jq('#vd-OutlineSelectedActiveNode').css({
                    top: target.offset().top,
                    left: target.offset().left,
                    width: target.outerWidth(),
                    height: target.outerHeight(),
                    display: 'block'
                });
			},

			desSelect: function (data) {
			},

            select: function(data, notPostMessage) {
                notPostMessage = notPostMessage || false;
                controllerOperations.showDesignerDraggerBorder(jq('[vdid=' + data.vdid + ']'))
                if(!notPostMessage) {
                    postMessageToFather.ctrlSelected(data);
                }
            },

            refreshCtrl: function(activeCtrl, attr, attrType) {

				if(attr.isTag) {

					let vdid  = activeCtrl.vdid;
					var elem = jq('[vdid='+ activeCtrl.vdid + ']');
					activeCtrl.vdid = activeCtrl.vdid + 'c';
					var elemGen = new ElemGenerator(activeCtrl);
					var tempElem = elemGen.createElement();
					tempElem.attr('vdid', vdid);
					elem = elem.replaceWith(tempElem[0].outerHTML);
					activeCtrl.vdid = vdid;
				}
				new ElemGenerator(activeCtrl).setAttributeByAttr(attr, attrType);
            }
		};

        var pageOperations = {
            applyCSS: function(cssText) {
                var oldStyle = jq('[sid="global-css"]').remove();
                var css = jq('<style sid="global-css">' + cssText + '</style>');
                jq('head').append(css);
            }
        };

		//点击其他区域隐藏border和i
        jq("body").on("click", function(e) {
            // controllerOperations.hideDesignerDraggerBorder();
            // postMessageToFather.pageSelected({
            //     key: ''
            // });

        });

        //拖拽初始化类
        function DndInitialization(options) {

            var self = this;

            this.containerSelector = '#VDDesignerContainer';
            this.inter = 0;

            this.makeComponentsDraggable();

        	jq(self.containerSelector).on("drop", function (e) {
        		self.onDrop(e);
        	})

        	jq(self.containerSelector).on("dragover", function (e) {
        		self.onOver(e);
        	})

        	jq(self.containerSelector).on("dragenter", function (e) {
        		self.onEnter(e);
        	})

        }

        DndInitialization.prototype = {
        	makeComponentsDraggable: function(cb) {
        		var self = this;
        		var components = jq(parentWindow.document, parentWindow.document).find('.anticons-list-item');

        		components.each(function(n) {
        			jq(this).attr("draggable", true);
        			jq(this).on("dragstart", function (e) {
		        		postMessageToFather.generateCtrlTree(parentWindow.VDDnddata);
		        		e.stopPropagation();
		        	});

		        	jq(this).on("dragend", function (e) {
		        		e.preventDefault();
		        	});
        		})
        	},

        	onEnter: function (e) {
        		e.stopPropagation();
        		e.preventDefault();
        		dndData.originalY = e.pageY;
        		dndData.originalX = e.pageY;
        	},

        	onOver: function (e) {
        		e.preventDefault();
        		e.stopPropagation();

        		var target = jq(e.target);

        		dndData.dragOverElem = target;

        		//是否是行级元素
        		if (target.outerWidth() < target.parent().innerWidth()) {
        			
        			var ref = (e.pageX - target.offset().left) / target.outerWidth();
        			var moveX = e.pageX - dndData.originalX;
        			
	        		if (target.data("container")) {

        				if (ref <= 1/3) {

		        			dndData.horizontalBefore(e, target);

		        		} else if (ref > 1/3 && ref < 2/3) {
		        			
		        			dndData.containerSpecialHandle(e, target);

		        		} else if (ref >= 2/3) {

		        			dndData.horizontalAfter(e, target);
		        		
		        		}
        			
        			}else {

	        			 if (target.attr("id") === 'VDDesignerContainer') {

		        			dndData.containerSpecialHandle(e, target);

		        		} else if (ref < 1/2) {

		        			dndData.horizontalBefore(e, target);

		        		} else if (ref >= 1/2) {

		        			dndData.horizontalAfter(e, target);
		        		
		        		}
		        	}
        		}else {
        			
        			var ref = (e.pageY - target.offset().top) / target.outerHeight();
        			var moveY = e.pageY - dndData.originalY;

        			if (target.data("container")) {

        				if (ref <= 1/3) {

		        			dndData.verticalBefore(e, target);

		        		} else if (ref > 1/3 && ref < 2/3) {
		        			
		        			dndData.containerSpecialHandle(e, target);

		        		} else if (ref >= 2/3) {

		        			dndData.verticalAfter(e, target);
		        		
		        		}
        				
        			}else {

	        			if (target.attr("id") === 'VDDesignerContainer') {

		        			dndData.containerSpecialHandle(e, target);

		        		}else if (ref < 1/2) {

		        			dndData.verticalBefore(e, target);

		        		} else if (ref >= 1/2) {

		        			dndData.verticalAfter(e, target);
		        		
		        		}
		        	}
        			
        		}

        	},

        	onDrop: function (e) {
        		e.preventDefault();
        		e.stopPropagation();

        		let handler = function () {
        			var needChangeClass = dndData.needChangeClass;
        		
	        		for(var i = 0; i < needChangeClass.length; i++) {
	        			var ncc = needChangeClass[i];
	        			if (ncc.type === 'remove') {
	        				ncc.target.removeClass(ncc.className);	
	        			}else {
	        				if (!ncc.target.hasClass(ncc.className)) {
		        				ncc.target.addClass(ncc.className)
		        			}
	        			}
	        			
	        		}

	        		dndData.needChangeClass = [];
        			dndData.isMouseDown = false;
        			controllerOperations.showDesignerDraggerBorder(dndData.dragElem);
        		}

        		if(guide.css("display") === 'none') {
        			dndData.isMouseDown = false;
					return false;
				}

        		controllerOperations.hideDesignerDraggerBorder();

        		if (guide.hasClass("error")) {
        			alert('非法位置');
        			handler();
					return false;
        		}

        		jq("#vdInsertGuide").after(dndData.dragElem);
        		if (!dndData.isMouseDown) {
        			postMessageToFather.elemAdded(dndData.ctrlToAddData);	
        		}
        		handler();

        	}
        }

        //生成dom类
        function ElemGenerator(params) {

        	this.controller = params;
        	this.tag = typeof this.controller.tag == 'object' ? this.controller.tag[0] : this.controller.tag;
        	this.elemLoaded = false;
        	return this;
        }

        ElemGenerator.prototype = {

        	initElem: function () {
        		if (!this.elemLoaded) {
                    var docCtrl = jq('[vdid='+ this.controller.vdid + ']');
                    this.elem = docCtrl.length > 0 ? docCtrl : jq(document.createElement(this.tag));
                    this.elemLoaded = true;
                    // this.refresh = docCtrl.length > 0;
                }
        	},

        	bindData: function () {
        		this.initElem();
        		this.elem.data('controller', this.controller);
        	},

            setCustomAttr: function(attr) {
                var self = this;
                var attrAction = {
                    add: function() {
                        self.elem.attr(attr.value.key, attr.value.value);
                    },

                    modify: function() {
                        self.elem.attr(attr.attrName, attr.value);
                    },

                    remove: function() {
                        self.elem.attr(attr.attrName, '');
                    }
                }

                if(attrAction[attr.action]) {
                    attrAction[attr.action]();
                }
            },

            setBasic: function(attr) {

                if(attr.isAttr) {
                    if(attr.value) {
                        this.elem.attr(attr.attrName, attr.value);
                    }
                }

                if(attr.isScreenSetting) {
                    var className = attr.value,
                        currentCtrlClass = this.elem.attr('class');

                    if(currentCtrlClass) {
                        var currentCtrlClassList = currentCtrlClass.split(' ');
                        for (var i = 0; i < currentCtrlClassList.length; i++) {
                            var cls = currentCtrlClassList[i];
                            for (var j = 0; j < attr.valueList.length; j++) {
                                var val = attr.valueList[j];
                                if(val.value == cls) {
                                    this.elem.removeClass(cls);
                                }
                            };
                        };
                    }

                    for (var i = 0; i < className.length; i++) {
                        var cls = className[i];
                        this.elem.addClass(cls);
                    };
                }

            },

            setAttr: function(attr) {

                if(attr.isHTML) {

					if(attr.html != null && attr.html != undefined){
						this.elem.html(attr.html);
					}else{
						this.elem.html(attr.value);
					}

                }

				if(attr.isToggleAttr){
					if(!attr.value)
						this.elem.removeAttr(attr.attrName);
					this.elem.attr(attr.attrName, attr.value);
				}
                if(attr.isAttr) {
					this.elem.attr(attr.attrName, attr.value);
                }
                if (attr.isContainer) {
                	this.elem.data(attr.name, attr.value);
                }

                if (attr.isSpecialParent) {
                	this.elem.data(attr.name, attr.value);
                }

                if (attr.isSpecialChild) {
                	this.elem.data(attr.name, attr.value);
                }

				if(attr.isStyle){
					this.elem.css(attr.name, attr.value);
				}
            },

            setLinkSetting: function(attr) {

                if(attr.isAttr) {
                    if(attr.attrName == 'target') {
                        if(attr.value) {
                            this.elem.attr(attr.attrName, '_blank');
                        }else {
                            this.elem.attr(attr.attrName, '');
                        }
                    }else {
                        var attrValue = attr.value,

                            getAttrValue = function (val, type) {
                                var typeList = {
                                    'link': '',
                                    'mail': 'mailto:',
                                    'phone': '',
                                    'page': '',
                                    'section': '#'
                                }
                                return typeList[type] + val;
                            }

                        attrValue = getAttrValue(attrValue, sessionStorage.currentActiveLinkType);


                        this.elem.attr(attr.attrName, attrValue);
                    }
                }
            },

            setImageSetting: function(attr) {
                if(attr.attrName == 'src') {
                    if(attr.value != '') {
                        this.withImage = true;
                    }
                }

                if(attr.isAttr) {
                    this.elem.attr(attr.attrName, attr.value);
                }

                if(attr.isImagePlaceholder) {
                    if(!this.withImage) {
                        this.elem.attr('src', 'https://d3e54v103j8qbb.cloudfront.net/img/image-placeholder.svg');
                    }
                }
            },

            setClassName: function(attr) {
                var classList = this.controller.className.concat(this.controller.customClassName);
                this.elem.attr('class', classList.join(' '));
            },

            transformTypeToUpper: function(type) {
                var settingTypeSplit = type.split('-'),
                    upperTypeName = '';
                for (var j = 0; j < settingTypeSplit.length; j++) {
                    var type = settingTypeSplit[j];
                    type = type.replace(/^\S/,function(s){return s.toUpperCase();});
                    upperTypeName += type;
                };

                return upperTypeName;
            },

        	setAttribute: function () {
        		this.initElem();
        		for(var i = 0, len = this.controller.attrs.length; i < len; i ++) {
        			var attr = this.controller.attrs[i];

                    if(attr.isAttrSetting) {
                        //基础属性设置（无复杂交互）统一处理
                        for (var j = 0; j < attr.children.length; j++) {
                            var att = attr.children[j];
                            this.setAttr(att);
                        };
                    }else {

                        //调用所需要的属性设置类型
                        var upperTypeName = this.transformTypeToUpper(attr.key);

                        if(this['set' + upperTypeName]) {
                            for (var j = 0; j < attr.children.length; j++) {
                                var att = attr.children[j];
                                this['set' + upperTypeName](att);
                            };
                        }

                    }
        		}

        		this.elem.attr('vdid', this.controller.vdid);
        	},

            setAttributeByAttr: function(attr, attrType) {

                this.initElem();
                this.bindData();
                var upperTypeName = this.transformTypeToUpper(attrType.key);
                if(attrType.isAttrSetting || attr.isStyle) {
                    this.setAttr(attr);
                }else {
                    if(this['set' + upperTypeName]) {
                        this['set' + upperTypeName](attr);
                    }
                }
            },

        	createElement: function () {
        		var self = this;

        		this.initElem();
        		this.bindData();
        		this.setAttribute();

        		var className = this.controller.className;
        		if (className) {
        			for(var i = 0, len = className.length; i < len; i ++) {
        				this.elem.addClass(className[i]);
        			}
        		}

        		var component = this.elem;

        		if (this.controller.children && this.controller.children.length > 0) {

                    for (var i = 0; i < this.controller.children.length; i++) {
                        var currentCtrl = this.controller.children[i],

                            reComGenerator = new ElemGenerator(currentCtrl),

                            loopComponent = reComGenerator.createElement(),

                            jqComponent = jq(component);

                        jqComponent.append(jq(loopComponent));

                    };

                }

                this.listenHover();
                this.listenClick();

                this.makeElemAddedDraggable();

                return component;
        	},

            listenHover: function() {
                var self = this;
                this.elem.hover(function(e) {
                    var target = jq(e.target);
                    var targetHeight = 0;

                    targetHeight = target.height();

                    jq('#vd-OutlineSelectedHoverNode').css({
                        top: target.offset().top,
                        left: target.offset().left,
                        width: target.outerWidth(),
                        height: target.outerHeight(),
                        display: 'block'
                    });
                }, function(e) {
                    jq('#vd-OutlineSelectedHoverNode').hide();
                });
            },

            listenClick: function() {
                var self = this;
                this.elem.click(function(e) {
                    e.stopPropagation();
                    var target = jq(e.target);
                    controllerOperations.select(target.data('controller'));
                    return false;
                });
            },

        	makeElemAddedDraggable: function () {

        		var self = this;

        		var designerContainer = jq("#VDDesignerContainer");
        		
        		designerContainer.on("mousedown", function (e) {
        			self.onDown(e);
        		});

        		designerContainer.on("mouseenter", function (e) {
        			self.onEnter(e);	
        			
        		});

        		designerContainer.on("mousemove", function (e) {
        			self.onMove(e);
        		});

        		designerContainer.on("mousemove", function (e) {
        			self.onMove(e);
        		})

        		designerContainer.on("mouseup", function (e) {
        			self.onUp(e);
        		});

        	},

        	onMove: function (e) {
        		
        		if (dndData.isMouseDown) {
        			jq(e.target).css({
        				cursor: 'pointer'
        			})
        			DndInitialization.prototype.onOver(e);
        		}
        	},
        	onEnter: function (e) {
        		if (dndData.isMouseDown) {
        			DndInitialization.prototype.onEnter(e);	
        		}
        	},
        	onDown: function (e) {
        		e.stopPropagation();
        		e.preventDefault();
        		
        		dndData.dragElemParent = jq(e.target).parent();
        		dndData.dragElem = jq(e.target);
        		dndData.isMouseDown = true;

        	},
        	onUp: function (e) {
    			DndInitialization.prototype.onDrop(e);
        	}
        }

        new DndInitialization();

	};

	//iframe加载完再执行
	window.addEventListener('message', function (evt) {
		var eventName = '',
			data = evt.data;

		for(var key in data) {
			eventName = key
		}

		if(eventName == 'VDDesignerLoaded') {
			dndHandlder();
		}

	})

})

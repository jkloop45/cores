import React, { PropTypes } from 'react';
import { connect } from 'dva';

import { Button, Modal, Spin } from 'antd';

const VDDesignerPanel = (props) => {

    const VDDesignerPanelProps = {

        hide() {
            props.dispatch({
                type: 'dashboard/hideDash'
            });
        },

        handleDesPanelLoaded() {
            window.VDDesignerFrame = window.frames["vdsite-designer"];
            setTimeout(function() {
                VDDesignerFrame.postMessage({
                    VDDesignerLoaded: {
                        load: true
                    }
                }, '*');

                props.dispatch({
                    type: 'vdcore/handleLoading',
                    payload: true
                });
                setTimeout(function(){
                    window.VDDesignerFrame.postMessage({
                        pageSelected: props.vdCtrlTree.layout[props.vdCtrlTree.activePage.key]
                    }, '*');
                    props.dispatch({
                        type: 'vdcore/handleLoading',
                        payload: false
                    });
                }, 2500)
                //加载全局CSS
                props.dispatch({
                    type: 'vdstyles/applyCSSStyleIntoPage',
                    payload: {
                        activeCtrl: props.vdCtrlTree.activeCtrl
                    }
                });

                //加载动画js
                setTimeout(function(){
                    props.dispatch({
                        type: 'vdanimations/applyScriptIntoPage'
                    })
                }, 2600)

            }, 500);
            $(window).off("keyup");
            $(window).on("keyup", {props}, function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (e.keyCode === 46) {
                    e.data.props.dispatch({
                        type: 'vdCtrlTree/deleteCtrl',
                        payload: {
                            fromKeyboard: true
                        }
                    })
                }
            })

        },
    };

    return ( <div className = "designer-wrapper"
                  style = {{ height: '100%' }}
             >
                <Spin spinning={props.vdcore.loading} style={{ height: 100, top: 'calc(50% - 100px)' }}>
                    <iframe className = "centen-VD"
                        name = "vdsite-designer"
                        width = { props.vdcore.VDDesigner[props.vdcore.VDDesigner.activeSize].width }
                        height = { props.vdcore.VDDesigner[props.vdcore.VDDesigner.activeSize].height }
                        frameBorder = "0"
                        src = "static/designer/vdsite/index.html"
                        onLoad = { VDDesignerPanelProps.handleDesPanelLoaded }
                    >
                    </iframe>
                    <div id="closeVDLeftPanel" className='close-VD-left-panel'></div>
                </Spin>
            </div>
    );

};

function mapSateToProps({ vdCtrlTree, vdcore, vdanimations }) {
    return { vdCtrlTree, vdcore, vdanimations };
}

export default connect(mapSateToProps)(VDDesignerPanel);

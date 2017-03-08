import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Spin, Button, Modal } from 'antd';

const Preview = (props) => {

  const PreviewProps = {

    hide () {
      props.dispatch({
        type: 'preview/hidePreview'
      });
    }



  };

  return (
    
      <div className="designer-wrapper">
            <Modal
              title="预览| Gospel - Web在线可视化集成开发环境"
              wrapClassName="vertical-center-modal"
              visible={props.preview.visible}
              wrapClassName="dashboard-wrapper"
              onCancel={PreviewProps.hide}
            >
              <Spin spinning={props.preview.spinVisible} tip="Loading..." className="preview-spin-size" size="large">
                <iframe
                  name="gospel-designer" 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  src={props.preview.src}
                  >
                  
                </iframe>
              </Spin>
            </Modal>
      </div>
      
  );

};

function mapSateToProps({ preview }) {
  return { preview };
}

export default connect(mapSateToProps)(Preview);
import React , {PropTypes} from 'react';
import { Tree } from 'antd';
import { Row, Col } from 'antd';
import { connect } from 'dva';

const TreeNode = Tree.TreeNode;

const DragSource = require('react-dnd').DragSource;

const Controllers = (props) => {

	const controllersProps = {

		onSelect (controller) {
			console.log(controller);
			props.dispatch({
				type: 'rightbar/setActiveMenu',
				payload: 'attr'
			});
		}

	}

  	return (

	    <Row>
	    	{props.designer.controllersList.map((controller, index) => (
				<Col span={12} key={index}>
	      			<div onClick={controllersProps.onSelect.bind(this, controller)} className={'app-components ' + controller.type}><span className="title">{controller.name}</span></div>
	      		</Col>
	    	))}
	    </Row>

  	);

};

function mapStateToProps({ designer, rightbar }) {
  return { designer, rightbar };
}

export default connect(mapStateToProps)(Controllers);

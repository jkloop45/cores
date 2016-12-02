import React , {PropTypes} from 'react';
import { Tabs, Icon, Popover, Collapse } from 'antd';

import { connect } from 'dva';

import ConstructionTree from './RightSidebar/ConstructionTree';
import FileTree from './RightSidebar/FileTree';
import Controllers from './RightSidebar/Controllers';
import CloumnLayout from './RightSidebar/CloumnLayout';
import Attr from './RightSidebar/Attr';
import SettingPanel from './RightSidebar/SettingPanel';

import SplitPane from 'react-split-pane';

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

const leftSidebar = (props) => {

	var handleTabChanged = function(key) {
		props.dispatch({
			type: 'sidebar/handleTabChanged',
			payload: key
		});
	}

	var styles = {
		tab: {
			minHeight: '100vh'
		},

		icon: {
			marginRight: '0px',
			marginBottom: '8px'
		},

		span: {
		 	writingMode: 'tb-rl'
		}
	}

	return (
	  	<Tabs tabPosition="left" activeKey={props.sidebar.activeMenu} onChange={handleTabChanged}>
	    	<TabPane style={styles.tab} tab={<span style={styles.span}><Icon style={styles.icon} type="bars" />结构</span>} key="controllers">
				<Collapse className="noborder attrCollapse consCollapse" bordered={false} defaultActiveKey={['controllers', 'construction']}>
				    <Panel header="结构" key="construction">
	    	    		<ConstructionTree></ConstructionTree>
				    </Panel>
				    <Panel header="控件" key="controllers">
	    	    		<Controllers></Controllers>
				    </Panel>
				</Collapse>
	    	</TabPane>
	    	<TabPane style={styles.tab} tab={<span style={styles.span}><Icon style={styles.icon} type="setting" />设置</span>} key="setting">
	    		<SettingPanel></SettingPanel>
	    	</TabPane>	    	
	  	</Tabs>
	)

}

function mapStateToProps({ sidebar }) {
  return { sidebar };
}

export default connect(mapStateToProps)(leftSidebar);

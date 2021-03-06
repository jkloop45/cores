import dva from 'dva';
import VDPackager from '../vdsite/VDPackager.js';
import { message } from 'antd';
import request from '../../utils/request.js';

export default {
  namespace: 'preview',

  state: {
    visible: false,
    src: '',
    spinVisible: true,
  },

  subscriptions: {

    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {

        var src = '';

        if(document.domain == 'localhost') {
          src = 'http://'+localStorage.domain
        }else {
          src = 'http://dash.gospely.com';
        }

        let visible = !!sessionStorage.previewVisibe;

        dispatch({
          type: 'setVible',
          payload: visible
        })

        dispatch({
          type: 'setSrc',
          payload: src
        });

      });
    }

  },
  //

  reducers: {

    hidePreview(state) {
      state.visible = false;
      sessionStorage.previewVisibe = '';
      return {...state};
    },
    showSpin(state, { payload: params}) {
      state.spinVisible = params;
      return {...state};
    },
    hideSpin(state, { payload: params}) {
      state.spinVisible = params;
      return {...state};
    },

    showPreview(state) {
      state.visible = true;
      sessionStorage.previewVisibe = true;
      return {...state};
    },

    setSrc(state, { payload: src }) {

      state.src = src;
      return {...state};
    },

    setVible(state, {payload: visible}) {
      state.visible = visible;
      return {...state};
    }

 },
effects:{

    *initPreviewer( { payload: params },  { call, put, select }){

        var layout = yield select(state => state.vdCtrlTree.layout),
            pages = yield select(state => state.vdpm.pageList),
            css = yield select(state => state.vdstyles.cssStyleLayout),
            currPage = yield select(state => state.vdpm.currentActivePageListItem),
            interaction = yield select(state => state.vdanimations);

        var struct = VDPackager.pack({layout, pages, css, interaction});

        message.success('请稍等，正在准备预览……');
        struct.folder = localStorage.dir;

        var packResult = yield request('vdsite/preview', {
          method: 'POST',
          headers: {
              "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify(struct)
        });

        yield put({
          type: 'setSrc',
          payload: 'http://' + localStorage.domain + '/pages/' + currPage + "?t" + new Date(),
        });

        // yield put({
        //   type: 'showPreview'
        // });
    }
}
}

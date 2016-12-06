
export default {
	init(props) {
		this.props = props;

		if(window.loadedOnce) {
			return false;
		}

		console.log('======================window.loadedOnce======================', window.loadedOnce);
		
		window.loadedOnce = true;

		window.addEventListener("message", (evt) =>  {

			var data = evt.data, 
				eventName = '';
				console.log("data::::::",data);
			const evtAction = {

				ctrlClicked () {
					console.log(eventName, data);
				},

				ctrlEdited () {
					console.log(eventName,data);
				},

				ctrlToBeAdded () {

					console.log('ctrlToBeAdded', data);

					props.dispatch({
						type: 'rightbar/setActiveMenu',
						payload: 'attr'
					});

					props.dispatch({
						type: 'designer/addController',
						payload: dndData
					});
					
				    props.dispatch({
				        type: 'attr/setFormItemsByDefault'
				    });

				},

				ctrlRemoved () {
					console.log(eventName,data);

				}

			}

			for(var key in data) {
				eventName = key
			}

			if(evtAction[eventName]) {

				console.log('typeof', typeof data[eventName]);

				if(typeof data[eventName] != 'object') {
					data = JSON.parse(data[eventName]);					
				}else {
					data = data[eventName];
				}
				evtAction[eventName]();
			}

		});
	}

}
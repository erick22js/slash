
function SLProject(){
	let proj = this;
	
	/*
		Classes
	*/
	// Base struct for every struct in project
	function SLObject_(type="SLObject_"){
		let self = this;
		let uid = SLObject_.uid++;
		let name = "";
		let description = "";
		let meta = {};
		
		// Getters/Setters
		self.getType = function(){
			return type;
		}
		self.getUid = function(){
			return uid;
		}
		self.getName = function(){
			return name;
		}
		self.setName = function(new_name){
			name = new_name;
		}
		self.getDescription = function(){
			return description;
		}
		self.setDescription = function(new_description){
			description = new_description;
		}
		self.getMeta = function(name){
			return meta[name];
		}
		self.hasMeta = function(name){
			return meta[name] !== 'undefined';
		}
		self.setMeta = function(name, value){
			meta[name] = value;
		}
	}
	SLObject_.uid = 1000000000;
	// Composites the figure as a graphical component
	function SLShape(){
		let self = this;
		/*
			Path is just a list of vectorized drawing methods
			each item is composed of:
			X of action
			Y of action
		*/
		let path = [];
		let closed = false;
		let line_width = 0;
		let back_color = (new Color());
		let line_color = (new Color());
		
		// Getters/Setters
		self.isClosed = function(){
			return closed;
		}
		self.setClosed = function(mode=false){
			closed = mode;
		}
		self.getLineWidth = function(){
			return line_width;
		}
		self.setLineWidth = function(width=0){
			line_width = width;
		}
		self.getBackColor = function(){
			return back_color;
		}
		self.getLineColor = function(){
			return line_color;
		}
		
		// Path Operations
		self.getPathLength = function(){
			return path.length;
		}
		self.getAction = function(index=Infinity){
			return path[index];
		}
		self.getActionIndex = function(action){
			return path.indexOf(action);
		}
		self.addPathAction = function(x, y, index=Infinity){
			let action = {"x":x, "y":y};
			path.splice(index, 0, action);
			return action;
		}
		self.moveAction = function(from, to){
			if (path.includes(from)){
				path.splice(path.indexOf(from), 1);
				path.splice(to, 0, from);
			}
			else {
				path.splice(to, 0, path.splice(from, 1)[0]);
			}
		}
		self.removeAction = function(index=Infinity){
			if (path.includes(index)){
				path.splice(path.indexOf(index), 1);
			}
			else {
				path.splice(index, 1);
			}
		}
	}
	// Is one of souces for animations, a vectorized graphic
	function SLFigure(){
		SLObject_.call(this, "SLFigure");
		let self = this;
		let shapes = [];
		
		// Shapes Operations
		self.getShapesCount = function(){
			return shapes.length;
		}
		self.getShape = function(index=Infinity){
			return shapes[index];
		}
		self.getShapeIndex = function(shape){
			return shapes.indexOf(shape);
		}
		self.createShape = function(index=Infinity){
			let shape = new SLShape();
			shapes.push(index, 0, shape);
			return shape;
		}
		self.moveShape = function(from, to){
			if (shapes.includes(from)){
				shapes.splice(shapes.indexOf(from), 1);
				shapes.splice(to, 0, from);
			}
			else {
				shapes.splice(to, 0, shapes.splice(from, 1)[0]);
			}
		}
		self.removeShape = function(index=Infinity){
			if (shapes.includes(index)){
				shapes.splice(shapes.indexOf(index), 1);
			}
			else {
				shapes.splice(index, 1);
			}
		}
	}
	// Is the first and main source for animations
	function SLImage(data){
		SLObject_.call(this, "SLImage");
		let self = this;
		let bitmap = new BitmapImage(data);
		
		// Getters/Setters
		self.getBitmap = function(){
			return bitmap;
		}
	}
	// Reference holder to source for every animation
	function SLInstance(_spr){
		SLObject_.call(this, "SLInstance");
		let self = this;
		let sprite = _spr;
		let initial = (new SLKeyframe()); // Default keyframe as initial state (with no first frame action defined)
		
		// Getters/Setters
		self.getInitial = function(){
			return initial;
		}
	}
	// Action and transformation for each instance
	function SLKeyframe(_src=null, _vsb=false, _tr=(new Matrix3x2(1, 0, 0, 1, 0, 0)), _clr=(new Color(1, 1, 1, 1)), _cmd=null){
		SLObject_.call(this, "SLKeyframe");
		let self = this;
		// Every null property sets object to invisible during entire tween
		let transform = (new Matrix3x2()).set(_tr); // Interpolable
		let color = (new Color()).set(_clr); // Interpolable
		let source = _src; // Non-Interpolable (no execution inside tweens)
		let visible = _vsb; // Non-Interpolable (no execution inside tweens)
		// If null, is not processed
		let command = _cmd; // Non-Interpolable (no execution inside tweens)
		
		// Getters/Setters
		self.getTransform = function(){
			return transform;
		}
		self.getColor = function(){
			return color;
		}
		self.getSource = function(){
			return source;
		}
		self.setSource = function(_src=null){
			source = _src;
		}
		self.getVisible = function(){
			return visible;
		}
		self.setVisible = function(_vs=false){
			visible = _vs;
		}
		self.getCommand = function(){
			return command;
		}
		self.setCommand = function(_cmd=null){
			command = _cmd;
		}
		self.copyFrom = function(keyframe){
			transform.set(keyframe.getTransform());
			color.set(keyframe.getColor());
			source = keyframe.getSource();
			visible = keyframe.getVisible();
			command = keyframe.getCommand();
		}
	}
	// Tween actions combination between actions
	function SLTween(_fa=(new SLKeyframe()), _la=null, _lim=1){
		SLObject_.call(this, "SLTween");
		let self = this;
		let first_keyframe = _fa;
		let last_keyframe = _la;
		let actions = [];
		let limit = _lim; // Limit of frames inside tween
		
		// Getters/Setters
		self.getFirstKeyframe = function(){
			return first_keyframe;
		}
		self.setFirstKeyframe = function(keyframe=null){
			first_keyframe = keyframe;
		}
		self.getLastKeyframe = function(){
			return last_keyframe;
		}
		self.setLastKeyframe = function(keyframe=null){
			last_keyframe = keyframe;
		}
		self.getLimit = function(){
			return limit;
		}
		self.setLimit = function(_lim=1){
			limit = _lim;
		}
		
		// Lists Handdles
		self.getAction = function(i){
			return actions[i];
		}
		self.getActions = function(){
			return actions.slice();
		}
		self._addAction = function(action, i=-1){
			if (action && !actions.includes(action)){
				if (i<0){
					actions.push(action);
				}
				else {
					actions.splice(i, 0, action);
				}
			}
		}
		self._removeAction = function(action){
			if (action && actions.includes(action)){
				actions.splice(actions.indexOf(action), 1);
			}
		}
		self._removeActionAt = function(i){
			actions.splice(i, 1);
		}
	}
	// Single action of a instance in a single frame
	function SLAction(_in=null, _off=0){
		SLObject_.call(this, "SLAction");
		let self = this;
		let instance = _in; // (cannot be null)
		let motion = (new SLKeyframe()); // Can be a tween or keyframe (cannot be null)
		let offset = _off; // Position relative to tween position
		
		// Getters/Setters
		self.getInstance = function(){
			return instance;
		}
		self.getAct = function(){
			return motion;
		}
		self.setAct = function(_mot=null){
			motion = _mot;
		}
		self.getOffset = function(){
			return offset;
		}
		self.setOffset = function(_off=null){
			offset = _off;
		}
	}
	// Frame with reference to many actions
	function SLFrame(_spr=null){
		SLObject_.call(this, "SLFrame");
		let self = this;
		let sprite = _spr;
		let actions = []; // Instances without action in current frame uses the default keyframe
		
		// Lists Handdles
		self.getActions = function(){
			return actions.slice();
		}
		self.getActionByInstance = function(instance){
			for (let i=0; i<actions.length; i++){
				if (actions[i].getInstance()==instance){
					return actions[i];
				}
			}
			return null;
		}
		self.addKeyframe = function(instance, keyframe=(instance.getInitial())){
			for (let i=0; i<actions.length; i++){
				if (actions[i].getInstance()==instance){
					actions.splice(i, 1);
					break;
				}
			}
			let action = new SLAction(instance);
			let new_keyframe = new SLKeyframe();
			new_keyframe.copyFrom(keyframe);
			action.setAct(new_keyframe);
			actions.push(action);
			return action;
		}
		self.createTween = function(instance, keyframe=(instance.getInitial())){
			let action = null;
			for (let i=0; i<actions.length; i++){
				if (actions[i].getInstance()==instance){
					if (actions[i].getAct() instanceof SLTween){
						return actions[i].getAct();
					}
					action = actions[i];
					break;
				}
			}
			if (!action){
				action = new SLAction(instance);
				let new_keyframe = new SLKeyframe();
				new_keyframe.copyFrom(keyframe);
				action.setAct(new_keyframe);
			}
			let tween = new SLTween(action.getAct());
			action.setAct(tween);
			return tween;
		}
		self.insertTween = function(instance, tween){
			for (let i=0; i<actions.length; i++){
				if (actions[i].getInstance()==instance){
					actions.splice(i, 1);
					break;
				}
			}
			let action = new SLAction(instance);
			action.setAct(tween);
			actions.push(action);
			return action;
		}
		self.removeAction = function(action){
			if (action && actions.includes(action)){
				actions.splice(actions.indexOf(action), 1);
			}
		}
		self.removeActionByInstance = function(instance){
			for (let i=0; i<actions.length; i++){
				if (actions[i].getInstance()==instance){
					actions.splice(i, 1);
					return;
				}
			}
		}
		self._removeSource = function(source){
			for (let i=0; i<actions.length; i++){
				let act = actions[i].getAct();
				if (act.getType()=="SLTween"){
					if (act.getFirstKeyframe() && act.getFirstKeyframe().getSource()==source){
						act.getFirstKeyframe().setSource(null);
					}
					if (act.getLastKeyframe() && act.getLastKeyframe().getSource()==source){
						act.getLastKeyframe().setSource(null);
					}
				}
				else {
					if (act.getSource()==source){
						act.setSource(null);
					}
				}
			}
		}
		self.removeAllActions = function(){
			actions.length = 0;
		}
	}
	// Animation object, also a source for animations
	function SLSprite(_lim=1){
		SLObject_.call(this, "SLSprite");
		let self = this;
		let instances = [];
		let frames = [];
		let index_frames = {}; // First named frames for jump in animations
		let limit = _lim; // Limit of runnable frames inside sprite
		
		// Getters/Setters
		self.getLimit = function(){
			return limit;
		}
		self.setLimit = function(_lim=1){
			limit = _lim;
		}
		
		// Lists Handdles
		self.getInstance = function(i){
			return instances[i];
		}
		self.getInstances = function(){
			return instances.slice();
		}
		self.addInstance = function(i=-1){
			let instance = new SLInstance(self);
			if (i<0){
				instances.push(instance);
			}
			else {
				instances.splice(i, 0, instance);
			}
			return instance;
		}
		self.removeInstance = function(instance){
			if (instance && instances.includes(instance)){
				for (let f=0; f<frames.length; f++){
					frames[f].removeActionByInstance(instance);
				}
				instances.splice(instances.indexOf(instance), 1);
			}
		}
		self.removeInstanceAt = function(ind){
			if (ind >= instances.length){
				return;
			}
			let instance = instances[ind];
			for (let f=0; f<frames.length; f++){
				frames[f].removeActionByInstance(instance);
			}
			instances.splice(ind, 1);
		}
		self._removeSource = function(source){
			for (let i=0; i<instances.length; i++){
				if (instances.getInitial().getSource()=source){
					instances.getInitial().setSource(null);
				}
			}
			for (let f=0; f<frames.length; f++){
				frames[f]._removeSource(source);
			}
		}
		self.getFrame = function(i){
			return frames[i];
		}
		self.getFrames = function(){
			return frames.slice();
		}
		self.addFrame = function(i=-1){
			let frame = new SLFrame(self);
			if (i<0){
				frames.push(frame);
			}
			else {
				frames.splice(i, 0, frame);
			}
			return frame;
		}
		self.removeFrame = function(i){
			frames.splice(i, 1);
		}
	}
	// Folder for resources organization in project
	function SLFolder(name=""){
		SLObject_.call(this, "SLFolder");
		let self = this;
		let list = [];
		self.setName(name);
		
		self.getResources = function(){
			return list.slice();
		}
		self.getResource = function(name){
			for (let i = 0; i<list.length; i++){
				if (list[i].getName() == name){
					return name;
				}
			}
			return null;
		}
		self.createFolder = function(name){
			let folder = new SLFolder(name);
			list.push(folder);
			return folder;
		}
		self.createImage = function(name, data=null){
			let image = new SLImage(data);
			image.setName(name);
			list.push(image);
			return image;
		}
		self.createSprite = function(name){
			let sprite = new SLSprite();
			sprite.setName(name);
			list.push(sprite);
			return sprite;
		}
		self._removeSourceDependancy = function(source){
			for (let i=0; i<list.length; i++){
				if (list[i].getType() == "SLSprite"){
					list[i]._removeSource(source);
				}
				if (list[i].getType() == "SLFolder"){
					list[i]._removeSourceDependancy(source);
				}
			}
		}
		self._removeResource = function(resource){
			for (let i = 0; i<list.length; i++){
				if (list[i] == resource){
					list.splice(i, 1);
					return;
				}
			}
		}
		self.removeResource = function(data){
			let resource = (typeof(data) === 'string')? self.getResource(data): data;
			self._removeSourceDependancy(resource);
			self._removeResource(resource);
		}
	}
	
	/*
		Project Objects
	*/
	
	/*
		Control Methods
	*/
	let root_folder = new SLFolder("root_folder");
	proj.getRootFolder = function(){
		return root_folder;
	}
}

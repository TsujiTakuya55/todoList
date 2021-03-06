(function(){

	//model
	var Task = Backbone.Model.extend({
		defaults:{
			title:'do something',
			completed:false
		},
		validate:function(attrs){
			if(_.isEmpty(attrs.title)){
				return "なんか入力してーや！";
			}
		},
		initialize:function(){
			this.on('invalid',function(model,error){
				$('#error').html(error);
			})
		}
	});
	
	//Collection(modelを複数扱うためのもの)
	var Tasks = Backbone.Collection.extend({model:Task}); 
	
	//View
	var TaskView = Backbone.View.extend({
		tagName:'li',
		initialize:function(){
			//[destroy]が押されたら削除！
			this.model.on('destroy',this.remove,this);
			this.model.on('change',this.render,this);
		},
		events:{
			'click .delete':'destroy',
			'click .toggle':'toggle'
		},
		toggle:function(){
			this.model.set('completed',!this.model.get('completed'));
		},
		remove:function(){
			this.$el.remove();
		},
		destroy:function(){
			if(confirm("削除してもいい？")){
				this.model.destroy();
			}
		},
		template:_.template($('#task-template').html()),
		render:function(){
			var template = this.template(this.model.toJSON());
			this.$el.html(template);
			return this;
		}
	});
	
	var TasksView = Backbone.View.extend({
		tagName:'ul',
		initialize:function(){
			this.collection.on('add',this.addNew,this);
			this.collection.on('change',this.updateCount,this);
			this.collection.on('destroy',this.updateCount,this);
		},
		addNew:function(task){
			var taskView = new TaskView({model:task});
			this.$el.append(taskView.render().el);
			$('#title').val('').focus();
			this.updateCount();
		},
		updateCount:function(){
			var uncompletedTasks = this.collection.filter(function(task){
				return !task.get('completed');	
			});
			$('#count').html(uncompletedTasks.length);
		},
		render:function(){
			this.collection.each(function(task){
				var taskView = new TaskView({model:task});
				this.$el.append(taskView.render().el);
			},this);
			this.updateCount();
			return this;
		}
	});
	
	//追加するフォームのview
	var AddTaskView = Backbone.View.extend({
		el:'#addTask',
		events: {
			'submit':'submit'
		},
		submit:function(e){
			e.preventDefault();
			//var task = new Task({title: $('#title').val() });
			var task = new Task();
			if(task.set({title: $('#title').val() },{validate:true})){
				this.collection.add(task);
				$('#error').empty();
			}
		}
	});
	
	//collectionのインスタンス生成
	var tasks = new Tasks([
		{
			title:'task1',
			completed:true
		},
		{
			title:'task2'
		},
		{
			title:'task3'
		}
	])
	
	var tasksView = new TasksView({collection:tasks});
	var addTaskView = new AddTaskView({collection:tasks});
	$('#tasks').html(tasksView.render().el);
})();
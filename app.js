//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose= require("mongoose");
const app = express();
const _ = require ("lodash");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//create database
mongoose.connect("mongodb+srv://admin-muskan:Test123@cluster0.pyl1h.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});




//create schema:schemma contain fields
const itemsSchema={
name:String}
//create mongoose model

const Item=mongoose.model("Item",itemsSchema);

//create documents
const item1= new Item({
	name:"Welcome to todolist"
});
const item2= new Item({
	name:"click + to add new task",
});
const item3= new Item({
	name:"hit --> to delete",
});	



const defaultItems=[item1,item2,item3];

const listSchema= {
	name:String,
	items:[itemsSchema],
};

const List=mongoose.model("List",listSchema);
app.get("/", function(req, res) {

  Item.find({},function(err,foundItem){
		  if(foundItem.length==0){
			  //insert all above documents
               Item.insertMany( defaultItems,function(err)
			  {
	            if(err){
		        console.log('sorry');
	                   }
	              else{
		        console.log("successful");
	                  }	
               }	
		  
		);
		res.redirect("/");
		}
		  else
		  {
		   res.render("list", {listTitle: "Today", newListItems: foundItem});
		  }
	  });



});


app.get("/:customListName",function(req,res)
{
	const customListName=_.capitalize(req.params.customListName);
	
	List.findOne({name:customListName},function(err,foundList)
		{
			if(!err){
				if(!foundList){
				//create a new list
				const list=new List({
					name:customListName,
					items:defaultItems,
				});
				list.save();
				res.redirect("/" + customListName);
				
				}else{
					//show the existing list
					res.render("list",{listTitle: foundList.name, newListItems: foundList.items})
				}
			}
		});
	
	
	
	
	
	
});


app.post("/delete",function(req,res)
{
const checked=req.body.checkbox;
const listName=req.body.listName;
if(listName=="Today"){
	
Item.findByIdAndRemove(checked,function(err)//delete by id
{
	if(err)
		console.log("sorry");
	else 
		console.log("success");
});
res.redirect('/');	
	
	
	
}

else{
	List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checked}}},function(err,foundList)
		{
			if(!err){res.redirect("/" + listName);}
		});
	
	
}

});





app.post("/", function(req, res){
	
const itemName=req.body.newItem;
const listName=req.body.list;

 const item= new Item({
	 name:itemName,
	 
 });
 if(listName==="Today")
 {
	 
 item.save();
 res.redirect('/');
 }
 else{
	 List.findOne({name:listName},function(err,foundList)
		 {
			 foundList.items.push(item);
			 foundList.save();
			 res.redirect("/" + listName);
		 });
 }
  
  
});
  
  
  
  
  
  
  
  
  
  
  
app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});





let port=process.env.PORT;
if (port ==null || port==" "){
	port=3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});

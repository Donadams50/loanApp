module.exports = mongoose => {
  var Schema = mongoose.Schema;
    var schema = mongoose.Schema(
      {
        
        groupName:String,
        groupDescription: String,
        loanTypes: [ {type: Schema.Types.ObjectId, ref: 'approvalprocess'} ],
  

      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      
      object.id = _id;
      return object;
    });
  
    const Group = mongoose.model("group", schema);
    return Group;
  };
  
  
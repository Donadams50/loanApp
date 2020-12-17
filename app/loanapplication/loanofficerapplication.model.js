module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        
        form:Object,
        status:String,
        branch:String,
        branchId: Number,
        assignedTo: String,
        signed:Array,
        customerApplicationId:String,
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const LoanOfficerApplication = mongoose.model("loanofficerapplication", schema);
    return LoanOfficerApplication;
  };
  
  
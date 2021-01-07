module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        
        form:Object,
        status:String,
        branch:String,
        branchId: String,
        loanOfficer: String
    

      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const CustomerApplication = mongoose.model("customerapplication", schema);
    return CustomerApplication;
  };
  
  
module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        
        form:Object,
        status:String,
        branch:String,
        branchId: String,
        assignedTo: String,
        declinedBy: String,
        loanOfficer: String,
        signed:Array,
        customerApplicationId:String,
        approvalProcessId: String,
        approvalProcess: Array,
        groupId: String,
        loanType: String,
        paymentStatus: String
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
  
  
module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        
        approvalProcess:Array,
        loanType: String,
        loanTypeDescription: String,
        groupId: String
    
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const ApprovalProcess = mongoose.model("approvalprocess", schema);
    return ApprovalProcess;
  };
  
  
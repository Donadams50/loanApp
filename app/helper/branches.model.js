module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        branchId: Number,
        branchName:String,
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Branch = mongoose.model("branch", schema);
    return Branch;
  };
  
  
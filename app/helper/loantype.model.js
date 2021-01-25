module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        loantype: String
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Loantype = mongoose.model("loantype", schema);
    return Loantype;
  };
  
  
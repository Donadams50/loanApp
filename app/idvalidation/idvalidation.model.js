module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        Bvndetail: Object
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Bvndetail = mongoose.model("bvndetail", schema);
    return Bvndetail;
  };
  
  
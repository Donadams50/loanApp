module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        fullName: String,
        role: String,
        roleId: Number,
        username:String,
        branch:String,
        branchId: Number,
        officeTitleBranch: String,
        email:String
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Profile = mongoose.model("profile", schema);
    return Profile;
  };
  
  
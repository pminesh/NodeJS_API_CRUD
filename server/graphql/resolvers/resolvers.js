import {empDB} from '../../model/employee_model.js'

const graphqlResolvers = {
  // ---------------get user data
//   {
//     users{
//       name
//       email
//       gender
//       status
//     }
//   }
  users: async () => {
    try {
      const usersFetched = await empDB.find()
      return usersFetched.map(user => {
        return {
          ...user._doc,
          _id: user.id,
        }
      })
    } catch (error) {
      throw error
    }
  },

  // ---------------create new user
//   mutation{
//     createUser(user:{name:"Ankush",email:"ankush@gmail.com",gender:"Male",status:"Active"}){
//       name
//       email
//       gender
//       status
//     }
//   }

  createUser: async args => {
    try {
      const { name, email, gender, status } = args.user
      const user = new empDB({
        name,
        email,
        gender,
        status,
      })
      const newUser = await user.save()
      return { ...newUser._doc, _id: newUser.id }
    } catch (error) {
      throw error
    }
  },

  // ---------------update User
//   mutation{
//     updateUser(user:{id:"62206c32207a39eb79d34f7f",name:"demo",email:"demo@gmail.com",gender:"Male",status:"Active"}){
//       name
//       email
//       gender
//       status
//     }
//   }

  updateUser: async args => {
    try {
      const updatePostInfo = empDB.findByIdAndUpdate(
        args.user.id,
        {
          $set: {
            name: args.user.name,
            email: args.user.email,
            gender: args.user.gender,
            status: args.user.status
          }
        },
        { new: true }
      )
      if (!updatePostInfo) {
        throw new Error('Error');
      }
      return updatePostInfo;

    } catch (error) {
      throw error
    }
  },

  // ---------------delete User by id
//   mutation{
//     deleteUser(user:{id:"62282f3c544c7896be460f19"}){
//       name
//     }
//   }
  deleteUser: async args => {
    const removeduser = empDB.findByIdAndRemove(
      args.user.id
    ).exec();

    if (!removeduser) {
      throw new Error('Error')
    }
    return removeduser;
  },

   // ---------------get user details by id
//   mutation{
//     getUserById(user:{id:"62273f2a53128dc07c001e10"}){
//       name
//       gender
//     }
//   }
  getUserById: async args => {
    const user_data = empDB.findById(args.user.id).exec();
    if (!user_data) {
      throw new Error('Error')
    }
    return user_data;
  }
}

export {graphqlResolvers}
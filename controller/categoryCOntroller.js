import { name } from 'ejs';
import categoryModel from '../models/categoryModel.js';
import axios from 'axios';
export const categoryCOntroller = async(req , res ) => {
   
    try {
        const {name} = req.body;
   if(!name) return res.send({error: 'Name is missing'});
   const existingcategory = await categoryModel.findOne({name});
   if(existingcategory) 
   {
     return res.status(200).send(
        {
            success: false,
            message: 'Already existingcategory'

        }
     )
   }
   const category = await new categoryModel("name").save();
   res.status(201).send({
    success: true,
    message: 'Category Added success',
    category
   })
        
    } catch (error) {
        
        console.log(error);
    }
 
}

export const getCategories  = async (req, res) =>
    {
        try {
          
            const { data } = await axios.get('https://dummyjson.com/products/categories',  {
                // your expected POST request payload goes here
                name: "My post name",
                url: "My post content."
                })
             // enter you logic when the fetch is successful
                console.log(`data: `, data)
            
            
        } catch (error) {
            console.log(error);
            res.send({error})
        }
      
    }

//export default categoryCOntroller



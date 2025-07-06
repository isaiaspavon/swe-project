import React from "react";
import Book from "../assets/Book-TheWayOfKings.jpg";


const ShoppingCartItem = () => {

  return (
    <div className="cart-item" style = {{
      display: "flex",
      flex: "250 650",
      alignItems: "flex-start",
      width: 800,
      height: 300,
      backgroundColor: "rgb(41, 41, 41)",
      marginBottom: 20,
      marginLeft:  30,
      boxShadow: "1px 1px 2px 2px rgb(53, 53, 53)",
     
    }
    }>
      <div className="Book Image Side" style = {{
      display: "flex",
      marginRight: 10,
      marginLeft: 15,
      width: 250,
      
    }
    }>
        <img src={Book} className="book-image" style = {{
      width: 200,
      height: 300,
      objectFit: "contain",
      border: 1,
      marginTop: 3,
      marginBottom: 3,
      marginLeft: 15,
      marginRight: 15,
      borderStyle: "solid",
      borderColor:"rgb(75, 75, 75)",

    }
    }/>
      </div>
      <div className = "right-side" style = {{
      width: 650,
      height: 300,
      display: "inline-block",
      alignContent: "top",
      textAlign: "center",
      justifyContent: "center",
    
    }
    }>
        <h3 className="book-title" style = {{
                alignContent: "top",
                fontSize: 30,   
                marginTop: 15,
                marginBottom: 0,           
              }}>
                The Way Of Kings
                </h3>
         <h1 className="book-author" style = {{
                alignContent: "top",
                fontSize: 15,   
                marginTop: 0,           
              }}>
                by Brandon Sanderson
                  </h1>
         <p className="book-price">Price: $20.00</p>
         <div className= "quantity-Button-Section" style = {{ 
                display: "flex",
                  alignItems: "top",
                  marginLeft: 10,
                  marginRight: 10,  
                  marginBottom: 15,
                  marginTop: 50,
                  alignContent: "top",
                  textAlign: "center",
                  justifyContent: "center",
              }
              }>
            <button className= "quantity-Button">-</button>   
              <p style = {{
                backgroundColor: "rgb(245, 240, 240)",
                color: "#00000",
                alignContent: "top",
                width: 30,
                border: 1,
                borderStyle: "solid",
                borderRadius: "10 10 10 10",
                height: 35,
                color: "black",
                display: "inline-block",  
                 textAlign: "center",
                 paddingTop: 7,
                marginTop: 0,
                marginBottom: 0,   
                marginLeft: -2,
                marginRight: -1,           
              }
               }> 2 </p>
              <button  className= "quantity-Button">+</button>  
          </div>
          <button className= "update-Button">Update Quantity</button>   
          <button className= "remove-Button"style = {{
                marginTop: 0,
                marginBottom: 0,   
                marginLeft: 8,
                marginRight: 0,           
              }
               }>Remove All Items</button>  
         
      </div>
    </div>
      
      
  );

};

export default ShoppingCartItem;
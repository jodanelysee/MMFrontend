import { Label, Select } from 'flowbite-react';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [books, setBooks] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  const [creditCard, setCreditCard] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);



  const handleSubmit = (event) => {
    event.preventDefault();
    const userID = localStorage.getItem("userID");
    const form = event.target;
    const card = creditCard._id;
    console.log("Card:", card);
    const orderObj = {
      card: card,
      user: userID,
      books: cart.map(book => ({ _id: book._id, title: book.title, price: book.price })), // Include book _id for updating
      totalPrice: totalPrice
    };
  
    console.log("Order Object:", orderObj);
  
    fetch(`https://mmbackend-zv50.onrender.com/place-order`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(orderObj)
    })
    .then(res => res.json())
    .then(data => {
      // Order successfully placed, now update purchased field of each book to true
      const updatePromises = orderObj.books.map(book => {
        return fetch(`https://mmbackend-zv50.onrender.com/book/${book._id}`, {
          method: 'PATCH',
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({ purchased: true }) // Update purchased field to true
        });
      });
      // After updating books, proceed to delete them from the cart
      Promise.all(updatePromises)
        .then(() => {
          fetch(`https://mmbackend-zv50.onrender.com/delete-cart/${userID}`, {
            method: "PATCH",
            headers: {
              "Content-type": "application/json"
            }
          })
        })
        .then(() => {
          // Optionally, update your UI or perform any other actions after successful submission
          alert("Order successful");
          window.location.reload(); // Reload the page or update UI as needed
        })
        .catch(error => {
          console.error('Error updating books or removing from cart:', error);
        });
    })
    .catch(error => {
      console.error('Error placing order:', error);
      alert('Failed to place order.');
    });
  };

  // Fetch user's credit cards
  useEffect(() => {
    const userId = localStorage.getItem("userID");
    fetch(`https://mmbackend-zv50.onrender.com/all-cards?userID=${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log("Card: ", data);
        setCreditCards(data);
        console.log(creditCards);
        console.log(data);
        setCreditCard(data[0])
        console.log("setit " + creditCard + data[0]);
      })
      .catch(error => console.error('Error fetching cards:', error));
  }, []);

  useEffect(() => {
    // check to see if userID is in local storage
    const userID = localStorage.getItem('userID');
    if (!userID) {
      // if userID is in local storage, redirect to login page
      window.location.replace('https://mmfrontend-97am.onrender.com/login');
    }
  });

  const handleRemoveFromCart = (bookId) => {
    const userId = localStorage.getItem("userID");
    fetch(`https://mmbackend-zv50.onrender.com/cart/${userId}/${bookId}`, {
      method: 'DELETE',
      headers: {
        "Content-type": "application/json"
      },
    })
      .then(res => {
        if (res.ok) {
          console.log("Book removed from cart.");
          //refresh the window
          window.location.reload();
          // Optionally, update your cart state or UI after successful removal
        } else {
          console.error('Failed to remove book from cart.');
        }
      })
      .catch(error => {
        console.error('Error:', error.message);
        alert('Failed to remove book from cart.');
      });
  };

  const handleCardChange = (event) => {
    const selectedCardId = event.target.value;
    console.log(selectedCardId);
    const selectedCard = creditCards.find(card => card._id === selectedCardId);
    console.log(selectedCard);
    if (selectedCard) {
      setCreditCard(selectedCard);
    }
    console.log(selectedCard)
  };
  

  useEffect(() => {
    const userId = localStorage.getItem("userID");
    fetch(`https://mmbackend-zv50.onrender.com/cart/${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log("Response from server:", data); // Log the response
        if (data && data.books && Array.isArray(data.books)) {
          setBooks(data.books);
        } else {
          console.error("Books data is not an array or missing:", data);
        }
      })
      .catch(error => console.error('Error fetching cart:', error));
  }, []);

  useEffect(() => {
    // Fetch book details for each book ID in the cart
    if (books.length > 0) {
      Promise.all(books.map(bookId =>
        fetch(`https://mmbackend-zv50.onrender.com/book/${bookId}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch book details');
            }
            return response.json();
          })
          .then(bookData => {
            console.log("Book data received:", bookData);
            return bookData;
          })
          .catch(error => {
            console.error('Error fetching book details:', error);
            return null; // Returning null for failed requests
          })
      ))
        .then(bookDetails => {
          // Filter out null values
          const filteredBookDetails = bookDetails.filter(book => book !== null);
          setCart(filteredBookDetails);
          // Calculate total price based on fetched book details
          const totalPrice = filteredBookDetails.reduce((acc, book) => acc + book.price, 0);
          setTotalPrice(totalPrice);
        })
        .catch(error => console.error('Error fetching book details:', error));
    }
  }, [books]);
  
  return (
    <div className='px-4 my-12'>
      <h2 className='mb-8 text-3xl font-bold'>Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center text-xl">Your cart is empty</p>
      ) : (
        <div className="mt-8">
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {cart.map((book, index) => (
                <li key={index} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{book.title}</h3>
                        <p className="ml-4">${book.price}</p>
                      </div>
                      <p className="text-sm text-gray-500">{book.author}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex">
                        <button
                          type="button"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                          onClick={() => handleRemoveFromCart(book._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* Checkout section */}
      {cart.length > 0 && (
        <div className="relative mx-auto w-full bg-white flex justify-center">
          <div className="grid min-h-screen grid-cols-10">
            <div className="col-span-full py-6 px-4 sm:py-12 lg:col-span-6 lg:py-24">
              <div className="mx-auto w-full max-w-lg">
                <h1 className="relative text-2xl font-medium text-gray-700 sm:text-3xl">Checkout<span className="mt-2 block h-1 w-10 bg-teal-600 sm:w-20"></span></h1>
                <form action="" className="mt-10 flex flex-col space-y-4">
                  <div>
                    <div>
                      <Label htmlFor='inputCard' value="Select Card" />
                    </div>
                    <Select
                      id='inputCard'
                      name='inputCard'
                      className='w-full rounded'
                      value={creditCard}
                      onChange={handleCardChange}
                    >
                      {creditCards.map((card) => (
                        <option key={card._id} value={card._id}>
                          {card.card_number}
                        </option>
                      ))}
                    </Select>
                  </div>
                </form>
                <p>Total Price: ${totalPrice}</p> {/* Display total price */}
                <button type="button" onClick={handleSubmit} className="mt-4 inline-flex w-full items-center justify-center rounded bg-teal-600 py-2.5 px-4 text-base font-semibold tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 focus:ring-teal-500 sm:text-lg">Place Order</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

import React, { useState } from "react";

const Modal = ({ show, handleClose, handleSubmit , setLoading }) => {
  const showHideClassName = show ? "modal display-flex" : "modal display-none";

  const [formData, setFormData] = useState({
    sender: "",
    receiver: "",
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
    handleClose();
    setLoading(true)
  };

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className="modal-header">
          <h1>Transaction</h1>
          <button onClick={handleClose}>X</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div>
              <label>Send From:</label>
              <input
                type="text"
                name="sender"
                value={formData.sender}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Send To:</label>
              <input
                type="text"
                name="receiver"
                value={formData.receiver}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Amount:</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={handleClose}>Close</button>
            <button type="submit">Submit</button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Modal;

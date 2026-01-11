// Modal System for Beautiful Alerts
class Modal {
    static show(title, message, type = 'info') {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal modal-${type}">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="Modal.hide(this)">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="Modal.hide(this)">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }
    
    static hide(element) {
        const modal = element.closest('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }
    
    static confirm(title, message, onConfirm, onCancel = null) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal modal-confirm">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="Modal.hide(this)">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="Modal.hide(this); ${onCancel ? 'onCancel()' : ''}">Cancel</button>
                    <button class="btn btn-primary" onclick="Modal.hide(this); ${onConfirm}">Confirm</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }
    
    static prompt(title, message, defaultValue = '', onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal modal-prompt">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="Modal.hide(this)">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                    <input type="text" class="modal-input" value="${defaultValue}" placeholder="Enter value">
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="Modal.hide(this)">Cancel</button>
                    <button class="btn btn-primary" onclick="Modal.getInputAndHide(this, '${onConfirm}')">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }
    
    static getInputAndHide(element, callback) {
        const modal = element.closest('.modal-overlay');
        const input = modal.querySelector('.modal-input');
        const value = input.value;
        modal.remove();
        eval(`${callback}('${value}')`);
    }
}

// Add modal styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s;
    }
    
    .modal {
        background: white;
        border-radius: 10px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s;
    }
    
    .modal.modal-success .modal-header {
        background: #2ecc71;
        color: white;
    }
    
    .modal.modal-error .modal-header {
        background: #e74c3c;
        color: white;
    }
    
    .modal.modal-warning .modal-header {
        background: #f39c12;
        color: white;
    }
    
    .modal.modal-info .modal-header {
        background: #3498db;
        color: white;
    }
    
    .modal.modal-confirm .modal-header {
        background: #9b59b6;
        color: white;
    }
    
    .modal-header {
        padding: 20px;
        border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .modal-header h3 {
        margin: 0;
        font-size: 18px;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: inherit;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .modal-body p {
        margin: 0;
        line-height: 1.5;
    }
    
    .modal-input {
        width: 100%;
        padding: 10px;
        margin-top: 10px;
        border: 2px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
    }
    
    .modal-footer {
        padding: 20px;
        border-top: 1px solid #eee;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(modalStyles);
export function registerCard(type, label) {
    customElements.whenDefined("hui-card-picker").then(() => {
        if(window._registerCard) {
            window._registerCard(type, label);
            return;
        }

        const cardPicker = customElements.get("hui-card-picker");
        cardPicker.prototype.firstUpdated = function () {
            this.customCardButtons = this.shadowRoot.querySelector("#custom") || document.createElement("div");
            this.customCardButtons.classList.add("cards-container");
            this.customCardButtons.id = "custom";
            this.customCardButtons.style.borderTop = "1px solid var(--primary-color)";
            this.shadowRoot.appendChild(this.customCardButtons);

            window._registerCard = (el, name) => {
                const button = document.createElement("mwc-button");
                button.type = "custom:"+el;
                button.innerHTML = name;
                button.addEventListener("click", this._cardPicked);
                this.customCardButtons.appendChild(button);
            };

            window._registerCard(type, label);
        };
    });
}

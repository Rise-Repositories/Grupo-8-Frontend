function Stack(capacidade) {
    this.pilha = new Array(capacidade);
    this.topo = -1;
  }
  
  // Método isEmpty
  Stack.prototype.isEmpty = function() {
    return this.topo === -1;
  };
  
  // Método isFull
  Stack.prototype.isFull = function() {
    return this.topo + 1 === this.pilha.length;
  };
  
  // Método push
  Stack.prototype.push = function(objeto) {
    if (this.isFull()) {
      throw new Error("Pilha cheia!");
    }
    this.pilha[++this.topo] = objeto;
  };
  
  // Método pop
  Stack.prototype.pop = function() {
    if (this.isEmpty()) {
      return null;
    }
    return this.pilha[this.topo--];
  };
  
  // Método peek
  Stack.prototype.peek = function() {
    if (this.isEmpty()) {
      return null;
    }
    return this.pilha[this.topo];
  };
  
  // Sobrecarga do método peek
  Stack.prototype.peekAt = function(topo) {
    if (this.isEmpty()) {
      return null;
    }
    return this.pilha[topo];
  };
  
  // Método exibe
  Stack.prototype.exibe = function() {
    if (this.isEmpty()) {
      console.log("Pilha vazia");
    } else {
      for (let i = this.topo; i >= 0; i--) {
        console.log(this.pilha[i]);
      }
    }
  };
  
module.exports = Stack;
  
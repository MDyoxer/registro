import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule,DialogModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  clients: any[] = [];
  newClient = { email: '', contra: '' }; 
  editingClient = { email: '', contra: '' }; 




  ngOnInit() {
    this.fetchClients();
  }


  editingClientId: number | null = null;

startEdit(id: number, email: string, contra: string) {
  this.editingClientId = id;
  this.editingClient.email = email;
  this.editingClient.contra = contra;
}

cancelEdit() {
  this.editingClientId = null;
  this.editingClient = { email: '', contra: '' };
}

//MOSTRAR CLIENTES
  fetchClients() {
    fetch('http://localhost/api/show_all.php')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        return response.json();
      })
      .then((data) => {
        this.clients = data;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
//ANADIR CLIENTE
  addClient() {
    if (!this.newClient.email || !this.newClient.contra) {
      alert('Por favor, complete todos los campos');
      return;
    }

    fetch('http://localhost/api/agregar.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `email=${encodeURIComponent(this.newClient.email)}&contra=${encodeURIComponent(this.newClient.contra)}`,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al agregar el cliente');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Cliente agregado:', data);
        // Refrescar la lista de clientes
        this.fetchClients();
        // Limpiar el formulario
        this.newClient = { email: '', contra: '' };
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
//ELIMINAR CLIENTE
  deleteClient(id: number) {
    fetch(`http://localhost/api/delete.php?id=${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al eliminar el cliente');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Cliente eliminado:', data);
        this.clients = this.clients.filter((client) => client.id !== id);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
//EDITAR CLIENTE
  editClient(id: number) {
    if (!this.editingClient.email || !this.editingClient.contra) {
      alert('Por favor, complete todos los campos para editar');
      return;
    }
  
    fetch(`http://localhost/api/actualizar.php?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `email=${encodeURIComponent(this.editingClient.email)}&contra=${encodeURIComponent(this.editingClient.contra)}`,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al actualizar el cliente');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Cliente actualizado:', data);
        this.fetchClients(); // Actualizar la tabla después de la edición
        this.editingClient = { email: '', contra: '' }; // Limpiar el formulario
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
}

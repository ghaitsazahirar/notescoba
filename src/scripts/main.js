// import './data/data.js';
import dataAPI from "./data/dataAPI.js";

let displayNotesOutside;
document.addEventListener('DOMContentLoaded', function () {
  const noteList = document.getElementById('note-list');
  const inputId = document.querySelector('#inputNoteNum');
  const inputTitle = document.getElementById('inputNotesTitle');
  const inputDesc = document.getElementById('inputNotesBody');
  const btnSubmit = document.getElementById('buttonSave');

  function displayNotes(notes) {
    console.log('displayNotes function is called with notes:', notes);
    noteList.innerHTML = ''; // Kosongkan noteList sebelum menampilkan catatan baru
    notes.forEach(note => {
      const noteElement = createNoteElement(note); // Menggunakan createNoteElement
      noteList.appendChild(noteElement);
    });
  }

  displayNotesOutside = displayNotes;

  const api = dataAPI(); // Panggil dataAPI() dan simpan instance-nya
  api.getNotes().then(notes => { // Gunakan then di sini
    displayNotes(notes);
  });

  const customValidationHandler = (event) => {
    event.target.setCustomValidity('');

    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity('Fill this.');
      return;
    }
  };

  const handleValidation = (event) => {
    const isValid = event.target.validity.valid;
    const errorMessage = event.target.validationMessage;

    const connectedValidationId = event.target.getAttribute('aria-describedby');
    const connectedValidationEl = connectedValidationId
      ? document.getElementById(connectedValidationId)
      : null;

    if (connectedValidationEl) {
      if (errorMessage && !isValid) {
        connectedValidationEl.innerText = errorMessage;
      } else {
        connectedValidationEl.innerText = '';
      }
    }
  }

  inputId.addEventListener('change', customValidationHandler);
  inputId.addEventListener('invalid', customValidationHandler);

  inputTitle.addEventListener('change', customValidationHandler);
  inputTitle.addEventListener('invalid', customValidationHandler);

  inputDesc.addEventListener('change', customValidationHandler);
  inputDesc.addEventListener('invalid', customValidationHandler);

  inputTitle.addEventListener('blur', handleValidation);
  inputDesc.addEventListener('blur', handleValidation);
  inputId.addEventListener('blur', handleValidation);

  noteList.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = inputId.value.trim();
    const title = inputTitle.value.trim();
    const body = inputDesc.value.trim();

    if (id && title && body) {
      api.createNotes(id, title, body)
        .then(() => {
          return api.getNotes();
        })
        .then(notes => {
          displayNotes(notes);
        })
        .catch(error => {
          console.error('Error:', error);
          // Tambahkan penanganan kesalahan di sini
          alert('Failed to add note. Please try again later.');
        });

      inputId.value = '';
      inputTitle.value = '';
      inputDesc.value = '';
    }
  });

  btnSubmit.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const id = inputId.value.trim();
    const title = inputTitle.value.trim();
    const body = inputDesc.value.trim();
    if (id && title && body) {
      api.createNotes(id, title, body)
        .then(() => {
          return api.getNotes();
        })
        .then(notes => {
          displayNotes(notes);
        })
        .catch(error => {
          console.error('Error:', error);
          // Tambahkan penanganan kesalahan di sini
          alert('Failed to add note. Please try again later.');
        });

      inputId.value = '';
      inputTitle.value = '';
      inputDesc.value = '';
    }
  });

  function createNoteElement(note) {
    const noteElement = document.createElement('note-item');
    noteElement.setNote({
      id: note.id,
      title: note.title,
      body: note.body
    });
    return noteElement;
  }

  function removeNoteFromList(noteElement) {
    noteElement.remove();
    const noteId = noteElement.getAttribute('data-id');
    api.removeNotes(noteId)
      .then(() => {
        return api.getNotes();
      })
      .then(notes => {
        displayNotes(notes);
      })
      .catch(error => {
        console.error('Error:', error);
        // Tambahkan penanganan kesalahan di sini
        alert('Failed to remove note. Please try again later.');
      });
  }

  class NoteItem extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.handleDelete = this.handleDelete.bind(this);
    }

    setNote(note) {
      this.note = note;
      this.render();
    }

    handleDelete() {
      removeNoteFromList(this.parentNode); // Menghapus catatan dari DOM
    }

    render() {
      this.shadowRoot.innerHTML = `
      <style>
      .note-column {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px;
          border-radius: 10px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      }

      .note-item {
          flex: 1;
          padding: 10px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 10px;
      }

      .note-item h5, .note-item p {
          margin: 0;
          font-size: 16px;
      }

      .note-item h5 {
          margin-bottom: 5px; /* Tambahkan margin-bottom di sini */
      }
      </style>

      <div class="col-lg-2 col-md-3 col-sm-4 col-6" style="margin-top: 12px;">
          <div class="card">
              <div class="card-body">
                  <div class="note-column">
                      <div class="note-item">
                          <h5>(${this.note.id}) ${this.note.title}</h5>
                          <p>${this.note.body}</p>
                      </div>
                      <button type="button" class="btn btn-danger button-delete">Delete</button>
                      <button type="button" class="btn btn-danger button-update">Update</button>
                  </div>
              </div>
          </div>
      </div>
      `;

      const buttonDelete = this.shadowRoot.querySelector('.button-delete');
      buttonDelete.addEventListener('click', () => {
        this.handleDelete();
      });
    }
  }

  class NoteList extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  }
  customElements.define('note-item', NoteItem);
  customElements.define('note-list', NoteList);
});
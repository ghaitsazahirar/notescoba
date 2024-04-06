import '../loading-indicator';
import '../main';


function dataAPI() {
    const notesData = 'https://notes-api.dicoding.dev/v2';

    const getNotes = async () => {
        const loadingIndicator = document.querySelector('loading-indicator');
        loadingIndicator.style.display = "block";

        try {
            const response = await fetch(`${notesData}/notes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to retrieve notes');
            }
            const responseJson = await response.json();
            loadingIndicator.style.display = "none"; // Move the hiding of loading indicator here
            return responseJson.data;
        } catch (error) {
            loadingIndicator.style.display = "none"; // Hide loading indicator in case of error
            showErrorResponse(error.message);
            throw error;
        }
    };

    const createNotes = async (id, title, body) => {
        try {
            const response = await fetch(`${notesData}/notes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    body: body,
                }),
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            await getNotes(); // Ambil data catatan yang diperbarui setelah berhasil menambahkan catatan baru
        } catch (error) {
            showErrorResponse(error.message);
            throw error;
        }
    };    

//     const removeNotes = (note_Id) => {
//     fetch(`${notesData}/notes/${note_Id}`, {
//         method: 'DELETE',
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Failed to delete note');
//         }
//         return response.json();
//     })
//     .then(responseJson => {
//         showResponseMessage(responseJson.message);
//         // Panggil getNotes untuk mengambil data terbaru dari API setelah menghapus catatan
//         return getNotes();
//     })
//     .then(notes => {
//         // Setelah mendapatkan catatan yang diperbarui, perbarui tampilan
//         displayNotes(notes);
//     })
//     .catch(error => {
//         showResponseMessage(error.message);
//     });
// };


    const removeNotes = (note_Id) => {
        fetch(`${notesData}/notes/${note_Id}`, {
          method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete note');
            }
            return response.json();
        })
        .then(responseJson => {
            showResponseMessage(responseJson.message);
        })
        .catch(error => {
            showResponseMessage(error.message);
        });
    };

    const renderNotes = (notes) => {
        let noteList = document.getElementById("note-list");
        if (!noteList) {
            console.error("Cannot find note list element.");
            return;
        }
    
        noteList.innerHTML = ''; // Clear the note list before rendering new notes
        
        if (notes && Array.isArray(notes)) {
            notes.forEach(note => {
                const noteItem = document.createElement("div");
                noteItem.classList.add("note-item");
                noteItem.innerHTML += `
                <style>
                    /* CSS styles */
                </style>
                <div class="col-lg-2 col-md-3 col-sm-4 col-6" style="margin-top: 12px;">
                    <div class="card">
                        <div class="card-body">
                            <div class="note-column">
                                <div class="note-item">
                                    <h5>(${note.id}) ${note.title}</h5>
                                    <p>${note.body}</p>
                                </div>
                                <button type="button" class="btn btn-danger button-delete" id="${note.id}">Delete</button>
                                <button type="button" class="btn btn-danger button-update" id="${note.id}">Update</button>
                            </div>
                        </div>
                    </div>
                </div>`;
                noteList.appendChild(noteItem);
            });
        }
    };    
    
    const showErrorResponse = (errorMessage) => {
        console.error(errorMessage);
        alert(errorMessage);
    };

    const showResponseMessage = (message = 'Reload Your Page.') => {
        alert(message);
    };
      
    return {
        getNotes,
        createNotes,
        removeNotes,
        renderNotes
    };
}

export default dataAPI;
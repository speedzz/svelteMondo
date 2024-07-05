<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import FileTable from '$lib/components/Table.svelte';
    export let data;
  
    let files = data.files;
    let fileInput: HTMLInputElement;
  
    const columns = [
      { name: 'File Name', key: 'name', sortable: true },
      { name: 'Size', key: 'size', sortable: false },
      { name: 'Last Modified', key: 'lastModified', sortable: true },
      { name: 'Actions', key: 'actions', sortable: false }
    ];
  
    function formatFileSize(bytes: number): string {
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      let size = bytes;
      let unitIndex = 0;
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
      return `${size.toFixed(2)} ${units[unitIndex]}`;
    }
  
    function formatDate(date: string): string {
      return new Date(date).toLocaleString();
    }
  
    async function logout() {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });
      
      if (response.ok) {
        await goto('/auth/login');
      } else {
        alert('Logout failed');
      }
    }
  
    async function uploadFile() {
      if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select a file to upload');
        return;
      }
  
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
  
        if (response.ok) {
          const newFile = await response.json();
          files = [...files, newFile];
          alert('File uploaded successfully');
          // Close the modal
          const modal = document.getElementById('uploadModal');
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          // Reset the file input
          fileInput.value = '';
        } else {
          const errorData = await response.json();
          alert(`File upload failed: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('An error occurred while uploading the file');
      }
    }
  
    const isAdmin = data.user.role === 'admin';
  
    onMount(() => {
      // Initialize Bootstrap modal

    });
  
    function customCellTemplate(file, key) {
      if (key === 'size') {
        return formatFileSize(file[key]);
      } else if (key === 'lastModified') {
        return formatDate(file[key]);
      } else if (key === 'actions') {
        return `
          <a href="/files/${file.name}" class="btn btn-sm btn-primary m-0" download>
            <i class="fas fa-download"></i>
          </a>
        `;
      } else {
        return file[key];
      }
    }
  </script>
  
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Welcome, {data.user.username}!</h2>
      <button class="btn btn-danger" on:click={logout}>Logout</button>
    </div>
    {#if isAdmin}
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="card-title mb-0">Files</h5>
          <div class="d-flex align-items-center">
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#uploadModal"><i class="fas fa-upload"></i></button>
          </div>
        </div>
        <div class="card-body p-0">
          <FileTable
            {files}
            {columns}
            itemsPerPage={10}
            customCellTemplate={customCellTemplate}
          />
        </div>
      </div>
    {:else}
      <p>You do not have permission to view this content.</p>
    {/if}
  </div>
  
  <!-- modal to upload file -->
  <div class="modal fade" id="uploadModal" tabindex="-1" aria-labelledby="uploadModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Upload File</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <input type="file" class="form-control" id="fileInput" bind:this={fileInput}>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" on:click={uploadFile}>Upload</button>
        </div>
      </div>
    </div>
  </div>
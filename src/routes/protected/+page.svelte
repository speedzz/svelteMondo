<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  export let data;

  const itemsPerPage = 10;
  let currentPage = 1;
  let searchTerm = '';
  let files = data.files;
  let fileInput: HTMLInputElement;
  let sortDirection = 'desc';

  $: filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  $: sortedFiles = filteredFiles.sort((a, b) => {
    const dateA = new Date(a.lastModified);
    const dateB = new Date(b.lastModified);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  $: totalPages = Math.ceil(sortedFiles.length / itemsPerPage);
  $: paginatedFiles = sortedFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  function changePage(newPage: number) {
    if (newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
    }
  }

  function toggleSortDirection() {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
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
    const modal = document.getElementById('uploadModal');
    new bootstrap.Modal(modal);
  });
</script>

<div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center">
    <h2>Welcome, {data.user.name}!</h2>
    <button class="btn btn-danger" on:click={logout}>Logout</button>
  </div>
  {#if isAdmin}
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">Files</h5>
        <div class="d-flex align-items-center">
          <input type="text" class="form-control me-2" placeholder="Search" bind:value={searchTerm}>
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#uploadModal"><i class="fas fa-upload"></i></button>
        </div>
      </div>
      <div class="card-body p-0">
        {#if paginatedFiles.length > 0}
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover table-responsive">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Size</th>
                  <th on:click={toggleSortDirection} style="cursor: pointer;">Last Modified {sortDirection === 'asc' ? '↑' : '↓'}</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {#each paginatedFiles as file}
                  <tr>
                    <td>{file.name}</td>
                    <td>{formatFileSize(file.size)}</td>
                    <td>{formatDate(file.lastModified)}</td>
                    <td class="text-center" style="width: 50px;">
                      <a href="/files/{file.name}" class="btn btn-sm btn-primary m-0" download>
                        <i class="fas fa-download"></i>
                      </a>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          <div class="card-footer">
            <div class="d-flex justify-content-end align-items-center m-0 h-100">
              <ul class="pagination pb-0 mb-0">
                <li class="page-item {currentPage === 1 ? 'disabled' : ''}">
                  <a class="page-link" href="#" on:click|preventDefault={() => changePage(currentPage - 1)} aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                {#each Array(totalPages) as _, i}
                  <li class="page-item {currentPage === i + 1 ? 'active' : ''}">
                    <a class="page-link" href="#" on:click|preventDefault={() => changePage(i + 1)}>{i + 1}</a>
                  </li>
                {/each}
                <li class="page-item {currentPage === totalPages ? 'disabled' : ''}">
                  <a class="page-link" href="#" on:click|preventDefault={() => changePage(currentPage + 1)} aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        {:else}
          <p class="text-center my-5">No files found.</p>
        {/if}
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
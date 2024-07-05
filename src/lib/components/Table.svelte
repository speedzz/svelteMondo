<script lang="ts">
  
    export let files = [];
    export let columns = [];
    export let itemsPerPage = 10;
    export let customCellTemplate;
  
    let currentPage = 1;
    let searchTerm = '';
    let sortDirection = 'desc';
  
    $: filteredFiles = files.filter(file => 
      columns.some(col => file[col.key] && file[col.key].toString().toLowerCase().includes(searchTerm.toLowerCase()))
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
  
    function changePage(newPage: number) {
      if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
      }
    }
  
    function toggleSortDirection() {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
  </script>
  
  <div class="d-flex align-items-center mb-2">
    <input type="text" class="form-control me-2" placeholder="Search" bind:value={searchTerm}>
  </div>
  
  <div class="table-responsive">
    <table class="table table-striped table-bordered table-hover table-responsive">
      <thead>
        <tr>
          {#each columns as column}
            <th on:click={column.sortable ? toggleSortDirection : null} style="cursor: {column.sortable ? 'pointer' : 'default'};">
              {column.name} {column.sortable && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each paginatedFiles as file}
          <tr>
            {#each columns as column}
              <td>
                {#if customCellTemplate}
                  {@html customCellTemplate(file, column.key)}
                {:else}
                  {file[column.key]}
                {/if}
              </td>
            {/each}
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
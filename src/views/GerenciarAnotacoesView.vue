<template>
  <div class="anotacoes-container">
    <h2>Gerenciar Anotações</h2>

    <!-- Form for creating a new annotation -->
    <div class="form-section">
      <h3>Cadastrar Nova Anotação</h3>
      <form @submit.prevent="incluir">
        <div class="form-group">
          <label for="texto">Texto: </label>
          <input type="text" id="texto" v-model="texto" required />
        </div>

        <div class="form-group">
          <label for="dataHora">Data/hora: </label>
          <input type="datetime-local" id="dataHora" v-model="dataHora" required />
        </div>

        <div class="form-group">
          <label for="usuario">Usuário: </label>
          <select id="usuario" v-model="idUsuario" required>
            <option value="">Selecione um usuário</option>
            <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
              {{ usuario.nome }}
            </option>
          </select>
        </div>

        <button type="submit" class="btn-cadastrar">Cadastrar</button>

        <p v-if="erro" class="error-message">{{ erro }}</p>
      </form>
    </div>

    <!-- Search form -->
    <div class="form-section">
      <h3>Pesquisar Anotações</h3>
      <form @submit.prevent="pesquisar">
        <div class="form-group">
          <label for="textoPesquisa">Texto: </label>
          <input type="text" id="textoPesquisa" v-model="textoPesquisa" required />
        </div>

        <div class="form-group">
          <label for="nomeUsuarioPesquisa">Nome de Usuário: </label>
          <input type="text" id="nomeUsuarioPesquisa" v-model="nomeUsuarioPesquisa" required />
        </div>

        <button type="submit" class="btn-pesquisar">Pesquisar</button>
      </form>
    </div>

    <!-- List of annotations -->
    <div class="list-section">
      <h3>Anotações</h3>
      <table v-if="anotacoes.length > 0">
        <thead>
          <tr>
            <th>Id</th>
            <th>Texto</th>
            <th>Antiguidade</th>
            <th>Usuário</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="anotacao in anotacoes" :key="anotacao.id">
            <td>{{ anotacao.id }}</td>
            <td>{{ anotacao.texto }}</td>
            <td>{{ calculateMonthDifference(anotacao.dataHora) }} meses</td>
            <td>{{ anotacao.usuario.nome }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="no-results">Nenhum registro foi encontrado para os critérios fornecidos</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Define interfaces for our data types
interface Usuario {
  id: number;
  nome: string;
}

interface Anotacao {
  id: number;
  texto: string;
  dataHora: string;
  usuario: Usuario;
}

// Form data
const texto = ref<string>('')
const dataHora = ref<string>('')
const idUsuario = ref<number>()
const erro = ref<string>('')

// Search data
const textoPesquisa = ref<string>('')
const nomeUsuarioPesquisa = ref<string>('')

// Lists
const anotacoes = ref<Anotacao[]>([])
const usuarios = ref<Usuario[]>([])

// Load all users for the dropdown
async function buscarUsuarios() {
  try {
    const response = await axios.get('usuario')
    usuarios.value = response.data
  } catch (e) {
    erro.value = (e as Error).message
  }
}

// Load all annotations
async function buscarAnotacoes() {
  try {
    const response = await axios.get('anotacao')
    anotacoes.value = response.data
    erro.value = ''
  } catch (e) {
    erro.value = (e as Error).message
  }
}

// Create a new annotation
async function incluir() {
  if (!texto.value || !dataHora.value || !idUsuario.value) {
    erro.value = 'Todos os campos são obrigatórios!'
    return
  }

  try {
    await axios.post('anotacao', {
      texto: texto.value,
      dataHora: dataHora.value,
      usuario: {
        id: idUsuario.value
      }
    })

    // Clear form and reload annotations
    texto.value = ''
    dataHora.value = ''
    idUsuario.value = undefined
    erro.value = ''

    await buscarAnotacoes()
  } catch (e) {
    erro.value = (e as Error).message
  }
}

// Search annotations by text and username
async function pesquisar() {
  if (!textoPesquisa.value || !nomeUsuarioPesquisa.value) {
    erro.value = 'Preencha todos os campos de pesquisa!'
    return
  }

  try {
    const response = await axios.get(`anotacao/${nomeUsuarioPesquisa.value}/${textoPesquisa.value}`)
    anotacoes.value = response.data
    erro.value = ''
  } catch (e) {
    erro.value = (e as Error).message
    anotacoes.value = []
  }
}

// Calculate months difference between a date and now
function calculateMonthDifference(dateString: string): number {
  const date = new Date(dateString)
  const now = new Date()

  const yearDiff = now.getFullYear() - date.getFullYear()
  const monthDiff = now.getMonth() - date.getMonth()

  return yearDiff * 12 + monthDiff
}

// Load data when component is mounted
onMounted(() => {
  buscarUsuarios()
  buscarAnotacoes()
})
</script>

<style scoped>
.anotacoes-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.form-section, .list-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: inline-block;
  width: 120px;
  font-weight: bold;
}

input, select {
  padding: 0.5rem;
  width: 300px;
}

button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

.error-message {
  color: red;
  margin-top: 0.5rem;
}

.no-results {
  font-style: italic;
  color: #666;
}
</style>

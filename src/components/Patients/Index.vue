<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-card elevation="3">
          <v-card-title>
            <span>Pacientes</span>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>

            <v-dialog v-model="dialog" persistent max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                  <v-icon small>mdi-face</v-icon>
                  <span class="patient-icon-text">Novo Paciente</span>
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">
                    <v-icon big>mdi-face</v-icon>
                    <span class="patient-icon-text">Cadastrar Paciente</span>
                  </span>
                </v-card-title>
                <v-card-text>
                  <v-progress-linear v-if="showSaveLoading" indeterminate color="primary"></v-progress-linear>
                  <v-alert v-if="success" type="success">{{ this.successMessage }}</v-alert>
                  <v-alert v-if="error" type="error">{{ this.errorMessage }}</v-alert>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field label="Nome Completo" v-model="editingPatient.name" required></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field label="CPF" v-model="editingPatient.cpf" required></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          label="Data de Nascimento"
                          v-model="editingPatient.birth"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field label="Telefone" v-model="editingPatient.phone" required></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          label="Indicado Por"
                          v-model="editingPatient.appointed_by"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" text @click="closeDialog()">Fechar</v-btn>
                  <v-btn
                    color="primary darken-1"
                    text
                    @click="editing ? editPatient(editingPatient.id, editingPatient) : createPatient(editingPatient)"
                  >Salvar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-title>
          <v-data-table
            class="elevation-1"
            :headers="headers"
            :items="patients"
            :search="search"
            :loading="loading"
            loading-text="Buscando os pacientes..."
            @dblclick:row="clickRow"
          >
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editMode(item)">mdi-pencil</v-icon>
              <v-icon small @click="deletePatient(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "patients-index",
  data() {
    return {
      dialog: false,
      patients: [],
      search: "",
      loading: false,
      editing: false,
      editingPatient: {},
      error: false,
      errorMessage: "",
      success: false,
      successMessage: "",
      showSaveLoading: false,
      patientObj: {
        id: null,
        name: "",
        cpf: "",
        birth: "",
        phone: "",
        appointed_by: "",
      },
      headers: [
        { text: "ID", value: "id" },
        { text: "Nome", value: "name" },
        { text: "CPF", value: "cpf" },
        { text: "Nascimento", value: "birth" },
        { text: "Telefone", value: "phone" },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  mounted() {
    this.editingPatient = Object.assign({}, this.patientObj);

    this.$emit("update:pageTitle", "Pacientes");
    this.getPatients();
  },
  methods: {
    async getPatients() {
      this.loading = true;
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const data = await response.json();

        for (var key in data) {
          this.patients = [
            ...this.patients,
            {
              id: data[key].id,
              name: data[key].name,
              cpf: "000.000.000-00",
              birth: "05/07/1992",
              phone: data[key].phone,
              appointed_by: "",
            },
          ];
        }

        this.loading = false;
      } catch (error) {
        console.error(error);
        this.loading = false;
      }
    },

    clickRow(row) {
      console.log(row);
    },

    editMode(patient) {
      this.editingPatient = Object.assign({}, patient);
      this.editing = true;

      this.dialog = true;
    },

    async createPatient(newPatient) {
      this.success = false;
      this.successMessage = "";

      this.showSaveLoading = true;

      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
          {
            method: "POST",
            body: JSON.stringify(newPatient),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          }
        );

        const data = await response.json();

        this.patients = [...this.patients, data];

        this.success = true;
        this.successMessage = "Paciente criado com sucesso!";

        this.editingPatient.id = data.id;
        this.editing = true;

        this.showSaveLoading = false;
      } catch (error) {
        console.error(error);
      }
    },

    async editPatient(id, editingPatient) {
      this.success = false;
      this.successMessage = "";

      this.showSaveLoading = true;

      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${id}`,
          {
            method: "PUT",
            body: JSON.stringify(editingPatient),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          }
        );

        const data = await response.json();

        this.patients = this.patients.map((patient) =>
          patient.id === id ? data : patient
        );

        this.success = true;
        this.successMessage = "Paciente salvo com sucesso!";

        this.showSaveLoading = false;
      } catch (error) {
        console.error(error);
      }
    },

    async deletePatient(patient) {
      console.log();
      try {
        await fetch(
          `https://jsonplaceholder.typicode.com/users/${patient.id}`,
          {
            method: "DELETE",
          }
        );

        this.patients = this.patients.filter(
          (patient) => patient.id !== patient.id
        );
      } catch (error) {
        console.error(error);
      }
    },

    closeDialog() {
      this.success = false;
      this.successMessage = "";

      this.error = false;
      this.errorMessage = "";

      this.editingPatient = Object.assign({}, this.patientObj);
      this.editing = false;
      console.log(this.editingPatient);
      this.dialog = false;
    },
  },
};
</script>

<style scoped>
.patient-icon-text {
  padding-left: 5px;
}
</style>
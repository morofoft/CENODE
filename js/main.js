// =====================
// FILTROS
// =====================
function getFilteredData() {
    let data = [...auditData];
  
    const desde = document.getElementById('f-desde').value;
    const hasta = document.getElementById('f-hasta').value;
    const dept = document.getElementById('f-dept').value;
  
    if (desde) data = data.filter(r => r.fecha >= desde);
    if (hasta) data = data.filter(r => r.fecha <= hasta);
    if (dept) data = data.filter(r => r.departamento === dept);
  
    return data;
  }
  
  function resetFilters() {
    document.getElementById('f-desde').value = '';
    document.getElementById('f-hasta').value = '';
    document.getElementById('f-dept').value = '';
    renderDashboard();
  }

  function renderCharts(data) { // ✅ recibir data

    if (!data) return; // 🔒 protección extra
  
    const map = {};
  
    data.forEach(r => {
      if (!map[r.departamento]) {
        map[r.departamento] = { total: 0, env: 0 };
      }
  
      map[r.departamento].total += r.total;
      map[r.departamento].env += r.enviadook;
    });
  
    // resto del código...
  }
  function initDashboard() {
    populateDeptFilter();
    renderDashboard();
  }

  function renderDashboard() {
    const data = getFilteredData();
  
    const total = data.reduce((s,r)=> s + r.total, 0);
    const env = data.reduce((s,r)=> s + r.enviadook, 0);
  
    document.getElementById("kpi-total").innerText = total;
    document.getElementById("kpi-env").innerText = env;
  
    renderCharts(data); // ✅ correcto
  }

  function populateDeptFilter() {
    const select = document.getElementById("f-dept");
  
    if (!select) return;
  
    const depts = [...new Set(auditData.map(r => r.departamento))];
  
    depts.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      select.appendChild(opt);
    });
  }


  function initRegistro() {
    loadDepts();
    setToday();
    renderTable();
    renderRecent(); 
  }

  function setToday() {
    const f = document.getElementById("fecha");
    if (f) {
      f.value = new Date().toISOString().split("T")[0];
    }
  }

  function loadDepts() {
    const select = document.getElementById("dept");
  
    const DEPTS = [
      "Electrocardiograma",
      "Rayos X",
      "Sonografía",
      "Laboratorio"
    ];
  
    DEPTS.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      select.appendChild(opt);
    });
  }

  function previewCalc() {
    const total = parseInt(document.getElementById("total").value) || 0;
    const env = parseInt(document.getElementById("env").value) || 0;
  
    const pct = total > 0 ? Math.round((env / total) * 100) : 0;
  
    document.getElementById("p-total").innerText = total;
    document.getElementById("p-env").innerText = env;
    document.getElementById("p-pct").innerText = pct + "%";
  }

  function saveAudit() {
    const record = {
      id: Date.now(),
      fecha: document.getElementById("fecha").value,
      departamento: document.getElementById("dept").value,
  
      total: parseInt(document.getElementById("total").value) || 0,
      factok: parseInt(document.getElementById("factok").value) || 0,
      realok: parseInt(document.getElementById("realok").value) || 0,
      resultok: parseInt(document.getElementById("resultok").value) || 0,
      enviadook: parseInt(document.getElementById("env").value) || 0,
      noenv: parseInt(document.getElementById("noenv").value) || 0,
      monto: parseFloat(document.getElementById("monto").value) || 0
    };
  
    // Validación básica
    if (!record.fecha || !record.departamento || record.total === 0) {
      alert("Completa los campos obligatorios");
      return;
    }
  
    // Cumplimiento
    record.cumplimiento = record.total > 0
      ? (record.enviadook / record.total) * 100
      : 0;
  
    auditData.push(record);
    saveStorage();

    
renderRecent();
  
    clearForm();
    renderTable();
  }
  function clearForm() {
    document.getElementById("total").value = "";
    document.getElementById("env").value = "";
    document.getElementById("noenv").value = "";
    document.getElementById("monto").value = "";
  
    previewCalc();
  }

  function renderTable() {
    const container = document.getElementById("tabla");
  
    if (!container) return;
  
    if (auditData.length === 0) {
      container.innerHTML = "<p>No hay registros</p>";
      return;
    }
  
    let html = "<table border='1' cellpadding='5'><tr><th>Fecha</th><th>Dept</th><th>Total</th><th>Env</th><th>%</th></tr>";
  
    auditData.slice(-10).reverse().forEach(r => {
      html += `<tr>
        <td>${r.fecha}</td>
        <td>${r.departamento}</td>
        <td>${r.total}</td>
        <td>${r.enviadook}</td>
        <td>${Math.round(r.cumplimiento)}%</td>
      </tr>`;
    });
  
    html += "</table>";
  
    container.innerHTML = html;
  }

  let auditData = JSON.parse(localStorage.getItem("auditData")) || [];
  function saveStorage() {
    localStorage.setItem("auditData", JSON.stringify(auditData));
  }

  function initReportes() {
    loadDeptReport();
  }

  function loadDeptReport() {
    const select = document.getElementById("r-dept");
  
    const depts = [...new Set(auditData.map(r => r.departamento))];
  
    depts.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      select.appendChild(opt);
    });
  }

  function generateReport() {

    const deptFilter = document.getElementById("r-dept").value;
  
    let data = deptFilter
      ? auditData.filter(r => r.departamento === deptFilter)
      : [...auditData];
  
    if (data.length === 0) {
      document.getElementById("report-table").innerHTML = "No hay datos";
      return;
    }
  
    // 🔢 KPIs
    const total = data.reduce((s,r)=>s+r.total,0);
    const env = data.reduce((s,r)=>s+r.enviadook,0);
    const monto = data.reduce((s,r)=>s+r.monto,0);
    const pct = total > 0 ? Math.round((env/total)*100) : 0;
  
    document.getElementById("r-total").innerText = total;
    document.getElementById("r-env").innerText = env;
    document.getElementById("r-pct").innerText = pct + "%";
    document.getElementById("r-monto").innerText = "$" + monto.toLocaleString();
  
    // 📊 AGRUPAR POR DEPARTAMENTO
    const map = {};
  
    data.forEach(r => {
      if (!map[r.departamento]) {
        map[r.departamento] = {
          total:0, env:0, monto:0
        };
      }
  
      map[r.departamento].total += r.total;
      map[r.departamento].env += r.enviadook;
      map[r.departamento].monto += r.monto;
    });
  
    // 🧾 TABLA
    let html = "<table border='1' cellpadding='6'><tr><th>Dept</th><th>Total</th><th>Enviado</th><th>%</th><th>Monto</th></tr>";
  
    for (let d in map) {
      const t = map[d].total;
      const e = map[d].env;
      const m = map[d].monto;
      const p = t > 0 ? Math.round((e/t)*100) : 0;
  
      html += `<tr>
        <td>${d}</td>
        <td>${t}</td>
        <td>${e}</td>
        <td>${p}%</td>
        <td>$${m.toLocaleString()}</td>
      </tr>`;
    }
  
    html += "</table>";
  
    document.getElementById("report-table").innerHTML = html;
  }

  function renderRecent() {
    const tbody = document.getElementById("recent-table-body");
    const empty = document.getElementById("recent-empty");
  
    if (!tbody) return;
  
    tbody.innerHTML = "";
  
    if (auditData.length === 0) {
      empty.style.display = "block";
      return;
    }
  
    empty.style.display = "none";
  
    auditData.slice().reverse().forEach(r => {
      const pct = Math.round(r.cumplimiento);
  
      const tr = document.createElement("tr");
  
      tr.innerHTML = `
        <td>${r.fecha}</td>
        <td>${r.departamento}</td>
        <td>${r.total}</td>
        <td>${r.enviadook}</td>
        <td>$${r.monto.toLocaleString()}</td>
        <td>${pct}%</td>
        <td>
          <button onclick="deleteRecord(${r.id})">✕</button>
        </td>
      `;
  
      tbody.appendChild(tr);
    });
  }

  function deleteRecord(id) {
    auditData = auditData.filter(r => r.id !== id);
    saveStorage();
    renderRecent();
  }

  let chartDept = null;
let chartEvolucion = null;


function renderCharts(data) {

    // =========================
    // 📊 AGRUPAR POR DEPARTAMENTO
    // =========================
    const map = {};
  
    data.forEach(r => {
      if (!map[r.departamento]) {
        map[r.departamento] = { total: 0, env: 0 };
      }
  
      map[r.departamento].total += r.total;
      map[r.departamento].env += r.enviadook;
    });
  
    const labels = Object.keys(map);
    const valores = labels.map(d => {
      const t = map[d].total;
      const e = map[d].env;
      return t > 0 ? Math.round((e / t) * 100) : 0;
    });
  
    // 🔥 destruir gráfico anterior
    if (chartDept) chartDept.destroy();
  
    chartDept = new Chart(document.getElementById("chartDept"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "% Cumplimiento",
          data: valores
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              callback: v => v + "%"
            }
          }
        }
      }
    });
  
  
    // =========================
    // 📈 EVOLUCIÓN DIARIA
    // =========================
    const dateMap = {};
  
    data.forEach(r => {
      if (!dateMap[r.fecha]) dateMap[r.fecha] = 0;
      dateMap[r.fecha] += r.enviadook;
    });
  
    const fechas = Object.keys(dateMap).sort();
    const valoresFecha = fechas.map(f => dateMap[f]);
  
    if (chartEvolucion) chartEvolucion.destroy();
  
    chartEvolucion = new Chart(document.getElementById("chartEvolucion"), {
      type: "line",
      data: {
        labels: fechas,
        datasets: [{
          label: "Enviado OK",
          data: valoresFecha,
          fill: true
        }]
      },
      options: {
        responsive: true
      }
    });
  }
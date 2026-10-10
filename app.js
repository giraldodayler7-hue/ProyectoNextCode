(() => {
    const storageKey = 'nexcode-barber-data-v1';
    const now = new Date();
    const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const asLocalDateTime = (date) => {
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().slice(0, 16);
    };
    const dateAt = (days, hour) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        date.setHours(hour, 0, 0, 0);
        return asLocalDateTime(date);
    };
    const initialData = {
        appointments: [
            { id: 'cita-1', client: 'Carlos Pérez', service: 'Corte Clásico', barber: 'bahian david', date: dateAt(3, 10), status: 'Agendada' },
            { id: 'cita-2', client: 'Andrés Gómez', service: 'Arreglo de Barba', barber: 'Simon losano', date: dateAt(3, 11), status: 'Agendada' }
        ],
        services: [
            { id: 'servicio-1', name: 'Corte Clásico', description: 'Corte tradicional con máquina y tijera, incluye acabado.', price: '25000', duration: '30 min' },
            { id: 'servicio-2', name: 'Arreglo de Barba', description: 'Perfilado con navaja, toalla caliente y aceites esenciales.', price: '15000', duration: '20 min' },
            { id: 'servicio-3', name: 'Combo NexCode', description: 'Corte tradicional y arreglo de barba con toalla caliente.', price: '35000', duration: '50 min' }
        ],
        barbers: [
            { id: 'barbero-1', name: 'bahian david', specialty: 'Cortes Clásicos & Fade', rate: '30000', schedule: 'Lun - Sáb: 9:00 AM - 6:00 PM', status: 'Disponible' },
            { id: 'barbero-2', name: 'Simon losano', specialty: 'Barba & Toalla Caliente', rate: '25000', schedule: 'Mar - Dom: 10:00 AM - 7:00 PM', status: 'Disponible' },
            { id: 'barbero-3', name: 'Dayler giraldo', specialty: 'Cortes Modernos & Barber Art', rate: '35000', schedule: 'Mié - Lun: 8:00 AM - 5:00 PM', status: 'En pausa' }
        ],
        clients: [
            { id: 'cliente-1', name: 'Carlos Pérez', email: 'carlos@example.com', phone: '3000000001' },
            { id: 'cliente-2', name: 'Andrés Gómez', email: 'andres@example.com', phone: '3000000002' }
        ],
        hours: [
            { id: 'horario-1', day: 'Lunes a viernes', opens: '09:00', closes: '18:00' },
            { id: 'horario-2', day: 'Sábado', opens: '09:00', closes: '16:00' }
        ],
        notifications: [],
        payments: [
            { id: 'pago-1', appointment: 'cita-1', amount: '25000', status: 'Pagado' }
        ],
        users: [
            { id: 'usuario-1', name: 'Administrador', email: 'admin@example.com', role: 'Administrador', status: 'Activo' }
        ]
    };
    const modules = {
        appointments: {
            title: 'Gestión de citas (RF-CI)',
            description: 'Registra, consulta, modifica, cancela y elimina citas. Los cambios quedan guardados en este navegador.',
            fields: [
                { key: 'client', label: 'Cliente', required: true, optionsFrom: 'clients', optionKey: 'name' },
                { key: 'service', label: 'Servicio', required: true, optionsFrom: 'services', optionKey: 'name' },
                { key: 'barber', label: 'Barbero', required: true, optionsFrom: 'barbers', optionKey: 'name' },
                { key: 'date', label: 'Fecha y hora', type: 'datetime-local', required: true },
                { key: 'status', label: 'Estado', type: 'select', options: ['Agendada', 'Completada', 'Cancelada'], required: true }
            ],
            columns: [
                { key: 'client', label: 'Cliente' }, { key: 'service', label: 'Servicio' },
                { key: 'barber', label: 'Barbero' }, { key: 'date', label: 'Fecha y hora', format: formatDate },
                { key: 'status', label: 'Estado' }
            ],
            actions: ['details', 'edit', 'cancel', 'delete']
        },
        services: {
            title: 'Catálogo de servicios (RF-SE)',
            description: 'Administra nombre, descripción, precio y duración de los servicios.',
            fields: [
                { key: 'name', label: 'Nombre', required: true },
                { key: 'description', label: 'Descripción', type: 'textarea', required: true },
                { key: 'price', label: 'Precio (COP)', type: 'number', min: '0', required: true },
                { key: 'duration', label: 'Duración', required: true, placeholder: 'Ej. 30 min' }
            ],
            columns: [
                { key: 'name', label: 'Servicio' }, { key: 'description', label: 'Descripción' },
                { key: 'price', label: 'Precio', format: formatPrice }, { key: 'duration', label: 'Duración' }
            ],
            actions: ['edit', 'delete']
        },
        barbers: {
            title: 'Directorio de barberos (RF-BA)',
            description: 'Consulta y administra perfiles, especialidades, tarifas, horarios y disponibilidad.',
            fields: [
                { key: 'name', label: 'Nombre completo', required: true },
                { key: 'specialty', label: 'Especialidades', required: true },
                { key: 'rate', label: 'Tarifa base (COP)', type: 'number', min: '0', required: true },
                { key: 'schedule', label: 'Horario', required: true },
                { key: 'status', label: 'Disponibilidad', type: 'select', options: ['Disponible', 'En pausa'], required: true }
            ],
            columns: [
                { key: 'name', label: 'Nombre' }, { key: 'specialty', label: 'Especialidades' },
                { key: 'rate', label: 'Tarifa', format: formatPrice }, { key: 'schedule', label: 'Horario' },
                { key: 'status', label: 'Disponibilidad' }
            ],
            actions: ['details', 'edit', 'delete']
        },
        clients: {
            title: 'Gestión de clientes (RF-CL)',
            description: 'Registra y consulta perfiles e historial de citas. Al eliminar se anonimiza el nombre en las citas existentes.',
            fields: [
                { key: 'name', label: 'Nombre completo', required: true },
                { key: 'email', label: 'Correo electrónico', type: 'email', required: true },
                { key: 'phone', label: 'Teléfono', type: 'tel' }
            ],
            columns: [
                { key: 'name', label: 'Nombre' }, { key: 'email', label: 'Correo' },
                { key: 'phone', label: 'Teléfono' }
            ],
            actions: ['details', 'edit', 'delete']
        },
        hours: {
            title: 'Horarios de atención (RF-HO)',
            description: 'Define, consulta, actualiza o elimina los horarios de apertura y cierre.',
            fields: [
                { key: 'day', label: 'Días', required: true, placeholder: 'Ej. Lunes a viernes' },
                { key: 'opens', label: 'Hora de apertura', type: 'time', required: true },
                { key: 'closes', label: 'Hora de cierre', type: 'time', required: true }
            ],
            columns: [
                { key: 'day', label: 'Días' }, { key: 'opens', label: 'Apertura' },
                { key: 'closes', label: 'Cierre' }
            ],
            actions: ['edit', 'delete']
        },
        notifications: {
            title: 'Notificaciones y recordatorios (RF-NO)',
            description: 'Redacta, consulta, modifica y elimina notificaciones. Los recordatorios se generan en el prototipo, pero no se envían por correo o SMS.',
            fields: [
                { key: 'title', label: 'Asunto', required: true },
                { key: 'message', label: 'Mensaje', type: 'textarea', required: true },
                { key: 'audience', label: 'Destinatarios', type: 'select', options: ['Clientes', 'Barberos', 'Todos'], required: true },
                { key: 'status', label: 'Estado', type: 'select', options: ['Borrador', 'Preparada'], required: true }
            ],
            columns: [
                { key: 'title', label: 'Asunto' }, { key: 'message', label: 'Mensaje' },
                { key: 'audience', label: 'Destinatarios' }, { key: 'status', label: 'Estado' }
            ],
            actions: ['edit', 'delete']
        },
        payments: {
            title: 'Pagos y administración (RF-AD)',
            description: 'Asocia pagos a citas y consulta métricas del prototipo. Los reportes se pueden descargar como CSV o imprimir/guardar como PDF.',
            fields: [
                { key: 'appointment', label: 'Cita', type: 'select', optionsFrom: 'appointments', optionKey: 'id', optionLabel: appointmentLabel, required: true },
                { key: 'amount', label: 'Monto (COP)', type: 'number', min: '0', required: true },
                { key: 'status', label: 'Estado del pago', type: 'select', options: ['Pendiente', 'Pagado', 'Reembolsado'], required: true }
            ],
            columns: [
                { key: 'appointment', label: 'Cita', format: (value, data) => appointmentLabel(data.appointments.find((item) => item.id === value)) },
                { key: 'amount', label: 'Monto', format: formatPrice }, { key: 'status', label: 'Estado' }
            ],
            actions: ['edit', 'delete']
        },
        users: {
            title: 'Administración de usuarios (RF-AD 04)',
            description: 'Prototipo de registro de cuentas y asignación de roles. No autentica usuarios ni aplica permisos reales sin un servidor.',
            fields: [
                { key: 'name', label: 'Nombre', required: true },
                { key: 'email', label: 'Correo electrónico', type: 'email', required: true },
                { key: 'role', label: 'Rol', type: 'select', options: ['Cliente', 'Barbero', 'Recepcionista', 'Administrador'], required: true },
                { key: 'status', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo'], required: true }
            ],
            columns: [
                { key: 'name', label: 'Nombre' }, { key: 'email', label: 'Correo' },
                { key: 'role', label: 'Rol' }, { key: 'status', label: 'Estado' }
            ],
            actions: ['edit', 'delete']
        }
    };

    function formatPrice(value) {
        const amount = Number(value);
        return Number.isFinite(amount) ? `$${amount.toLocaleString('es-CO')}` : escapeHtml(value || '');
    }

    function formatDate(value) {
        if (!value) return '';
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? escapeHtml(value) : date.toLocaleString('es-CO');
    }

    function appointmentLabel(appointment) {
        if (!appointment) return 'Cita no disponible';
        return `${appointment.client} · ${appointment.service} · ${formatDate(appointment.date)}`;
    }

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, (character) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[character]);
    }

    function loadData() {
        const saved = localStorage.getItem(storageKey);
        if (saved === null) {
            localStorage.setItem(storageKey, JSON.stringify(initialData));
            return structuredClone(initialData);
        }
        const data = JSON.parse(saved);
        for (const key of Object.keys(initialData)) {
            if (!Array.isArray(data[key])) throw new Error(`Los datos guardados del módulo "${key}" no son válidos.`);
        }
        return data;
    }

    let data;
    try {
        data = loadData();
    } catch (error) {
        document.querySelector('main')?.replaceChildren();
        const message = document.createElement('p');
        message.className = 'alert alert-danger m-4';
        message.textContent = `No se pudieron cargar los datos locales: ${error.message}`;
        document.querySelector('body').append(message);
        return;
    }

    function saveData() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (error) {
            window.alert(`No se pudieron guardar los cambios: ${error.message}`);
            throw error;
        }
    }

    function createId() {
        return globalThis.crypto?.randomUUID?.() || `registro-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    function renderHomeLinks() {
        const hero = document.querySelector('.hero-section');
        if (!hero) return;
        const section = document.createElement('section');
        section.className = 'container py-5';
        section.innerHTML = `
            <h2 class="text-warning fw-bold mb-4">Procesos del sistema</h2>
            <div class="row g-3">
                ${Object.entries({
                    appointments: 'Citas', services: 'Servicios', barbers: 'Barberos',
                    clients: 'Clientes', hours: 'Horarios', notifications: 'Notificaciones',
                    payments: 'Pagos y reportes', users: 'Usuarios y roles'
                }).map(([key, title]) => `
                    <div class="col-sm-6 col-lg-3">
                        <a class="card bg-dark text-light border-warning h-100 text-decoration-none p-3 app-module-link"
                            href="gestion.html#${key}">
                            <strong class="text-warning">${title}</strong>
                            <span class="small text-secondary mt-2">Abrir módulo de gestión →</span>
                        </a>
                    </div>`).join('')}
            </div>`;
        hero.after(section);
    }

    function renderFormField(field, value = '') {
        const id = `field-${field.key}`;
        const common = `id="${id}" name="${field.key}" class="form-control" ${field.required ? 'required' : ''}`;
        if (field.type === 'textarea') {
            return `<div class="mb-3"><label class="form-label" for="${id}">${field.label}</label><textarea ${common} rows="3">${escapeHtml(value)}</textarea></div>`;
        }
        let control;
        if (field.type === 'select' || field.options || field.optionsFrom) {
            const options = field.optionsFrom
                ? (data[field.optionsFrom] || []).map((item) => ({
                    value: item[field.optionKey],
                    label: field.optionLabel ? field.optionLabel(item) : item[field.optionKey]
                }))
                : (field.options || []).map((item) => ({ value: item, label: item }));
            control = `<select ${common}><option value="">Selecciona...</option>${options.map((option) => `
                <option value="${escapeHtml(option.value)}" ${String(option.value) === String(value) ? 'selected' : ''}>${escapeHtml(option.label)}</option>`).join('')}</select>`;
        } else {
            control = `<input ${common} type="${field.type || 'text'}" value="${escapeHtml(value)}"
                ${field.min !== undefined ? `min="${field.min}"` : ''}
                ${field.placeholder ? `placeholder="${escapeHtml(field.placeholder)}"` : ''}>`;
        }
        return `<div class="mb-3"><label class="form-label" for="${id}">${field.label}</label>${control}</div>`;
    }

    function renderModule(page) {
        const module = modules[page];
        const main = document.querySelector('main');
        if (!module || !main) return;
        const records = data[page];
        const headers = module.columns.map((column) => `<th>${column.label}</th>`).join('');
        const rows = records.map((record) => `
            <tr data-record-id="${escapeHtml(record.id)}">
                ${module.columns.map((column) => `<td>${column.format ? column.format(record[column.key], data) : escapeHtml(record[column.key])}</td>`).join('')}
                <td><div class="d-flex flex-wrap gap-2">${module.actions.map((action) => actionButton(action)).join('')}</div></td>
            </tr>`).join('');
        const totals = page === 'payments' ? renderDashboardStats() : '';
        main.className = 'container py-5';
        main.innerHTML = `
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <a class="link-warning small" href="index.html">← Inicio</a>
                    <h1 class="h2 text-warning fw-bold mt-2">${module.title}</h1>
                    <p class="text-secondary mb-0">${module.description}</p>
                </div>
                <div class="d-flex gap-2 flex-wrap">
                    ${page === 'notifications' ? '<button class="btn btn-outline-warning" type="button" data-app-action="reminders">Generar recordatorios</button>' : ''}
                    ${page === 'payments' ? '<button class="btn btn-outline-warning" type="button" data-app-action="csv">Descargar CSV</button><button class="btn btn-outline-light" type="button" data-app-action="print">Imprimir / PDF</button>' : ''}
                    <button class="btn btn-warning fw-bold text-dark" type="button" data-app-action="new">+ Registrar</button>
                </div>
            </div>
            ${totals}
            <div class="mb-3"><label class="visually-hidden" for="appFilter">Buscar</label>
                <input id="appFilter" class="form-control" type="search" placeholder="Buscar en ${module.title.toLowerCase()}..." aria-label="Buscar registros"></div>
            <div class="table-responsive bg-dark p-3 rounded shadow border border-warning border-opacity-25">
                <table class="table table-dark table-striped align-middle mb-0">
                    <thead><tr class="text-warning">${headers}<th>Acciones</th></tr></thead>
                    <tbody>${rows || `<tr><td colspan="${module.columns.length + 1}" class="text-center text-secondary py-4">No hay registros todavía.</td></tr>`}</tbody>
                </table>
            </div>
            <dialog class="app-dialog">
                <form class="app-form">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h2 class="h5 text-warning mb-0" data-form-title>Registrar</h2>
                        <button type="button" class="btn-close btn-close-white" data-app-action="close" aria-label="Cerrar"></button>
                    </div>
                    <input type="hidden" name="recordId">
                    ${module.fields.map((field) => renderFormField(field)).join('')}
                    <div class="d-flex justify-content-end gap-2">
                        <button type="button" class="btn btn-secondary" data-app-action="close">Cancelar</button>
                        <button type="submit" class="btn btn-warning fw-bold text-dark">Guardar</button>
                    </div>
                </form>
            </dialog>`;
        bindModuleEvents(page, module);
    }

    function actionButton(action) {
        const labels = { details: 'Ver', edit: 'Modificar', cancel: 'Cancelar', delete: 'Eliminar' };
        const styles = { details: 'btn-info', edit: 'btn-warning', cancel: 'btn-secondary', delete: 'btn-danger' };
        return `<button type="button" class="btn btn-sm ${styles[action]}" data-row-action="${action}">${labels[action]}</button>`;
    }

    function renderDashboardStats() {
        const appointments = data.appointments;
        const active = appointments.filter((item) => item.status === 'Agendada').length;
        const cancelled = appointments.filter((item) => item.status === 'Cancelada').length;
        const revenue = data.payments.filter((item) => item.status === 'Pagado').reduce((sum, item) => sum + Number(item.amount || 0), 0);
        const barberPerformance = data.barbers.map((barber) => ({
            name: barber.name,
            completed: appointments.filter((item) => item.barber === barber.name && item.status === 'Completada').length
        }));
        return `<div class="row g-3 mb-4">
            <div class="col-md-4"><div class="card bg-dark text-light border-warning p-3"><span class="text-warning">Citas agendadas</span><strong>${active}</strong></div></div>
            <div class="col-md-4"><div class="card bg-dark text-light border-danger p-3"><span class="text-danger">Citas canceladas</span><strong>${cancelled}</strong></div></div>
            <div class="col-md-4"><div class="card bg-dark text-light border-success p-3"><span class="text-success">Ingresos registrados</span><strong>${formatPrice(revenue)}</strong></div></div>
            <div class="col-12"><div class="card bg-dark text-light border-secondary p-3">
                <h2 class="h6 text-warning">Citas registradas</h2>
                ${appointments.map((item) => `<div class="d-flex flex-wrap justify-content-between gap-2 border-bottom border-secondary py-2"><span>${escapeHtml(item.client)} · ${escapeHtml(item.service)} · ${escapeHtml(item.barber)}</span><span>${formatDate(item.date)} · ${escapeHtml(item.status)}</span></div>`).join('') || '<span class="text-secondary">Sin citas registradas.</span>'}
            </div></div>
            <div class="col-12"><div class="card bg-dark text-light border-secondary p-3">
                <h2 class="h6 text-warning">Citas completadas por barbero</h2>
                ${barberPerformance.map((item) => `<div class="d-flex justify-content-between border-bottom border-secondary py-2"><span>${escapeHtml(item.name)}</span><strong>${item.completed}</strong></div>`).join('') || '<span class="text-secondary">Sin barberos registrados.</span>'}
            </div></div>
        </div>`;
    }

    function bindModuleEvents(page, module) {
        const main = document.querySelector('main');
        const dialog = main.querySelector('dialog');
        const form = main.querySelector('.app-form');
        main.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (!button) return;
            const row = button.closest('[data-record-id]');
            if (button.dataset.appAction === 'new') {
                form.reset();
                form.elements.recordId.value = '';
                form.querySelector('[data-form-title]').textContent = `Registrar ${module.title.split(' (')[0].toLowerCase()}`;
                if (page === 'appointments') form.elements.status.value = 'Agendada';
                if (page === 'notifications') form.elements.status.value = 'Borrador';
                if (page === 'users') form.elements.status.value = 'Activo';
                dialog.showModal();
            } else if (button.dataset.appAction === 'close') {
                dialog.close();
            } else if (button.dataset.appAction === 'csv') {
                downloadCsv(page, module);
            } else if (button.dataset.appAction === 'print') {
                window.print();
            } else if (button.dataset.appAction === 'reminders') {
                generateReminders();
                renderModule(page);
            } else if (row && button.dataset.rowAction) {
                handleRowAction(page, module, row.dataset.recordId, button.dataset.rowAction, form, dialog);
            }
        });
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const values = Object.fromEntries(new FormData(form).entries());
            const id = values.recordId;
            delete values.recordId;
            if (page === 'appointments') {
                const conflict = data.appointments.find((appointment) =>
                    appointment.id !== id &&
                    appointment.status === 'Agendada' &&
                    appointment.barber === values.barber &&
                    appointment.date === values.date
                );
                if (conflict) {
                    window.alert('Ese barbero ya tiene una cita agendada en esa fecha y hora.');
                    return;
                }
            }
            if (page === 'hours' && values.opens >= values.closes) {
                window.alert('La hora de cierre debe ser posterior a la hora de apertura.');
                return;
            }
            const existing = data[page].find((record) => record.id === id);
            if (existing) {
                if (page === 'clients' && existing.name !== values.name) {
                    data.appointments.forEach((appointment) => {
                        if (appointment.client === existing.name) appointment.client = values.name;
                    });
                }
                if (page === 'services' && existing.name !== values.name) {
                    data.appointments.forEach((appointment) => {
                        if (appointment.service === existing.name) appointment.service = values.name;
                    });
                }
                if (page === 'barbers' && existing.name !== values.name) {
                    data.appointments.forEach((appointment) => {
                        if (appointment.barber === existing.name) appointment.barber = values.name;
                    });
                }
                Object.assign(existing, values);
            } else data[page].push({ id: createId(), ...values });
            saveData();
            renderModule(page);
        });
        main.querySelector('#appFilter').addEventListener('input', (event) => {
            const term = event.target.value.trim().toLocaleLowerCase();
            main.querySelectorAll('tbody tr').forEach((row) => {
                row.hidden = !row.textContent.toLocaleLowerCase().includes(term);
            });
        });
    }

    function handleRowAction(page, module, id, action, form, dialog) {
        const record = data[page].find((item) => item.id === id);
        if (!record) return;
        if (action === 'delete') {
            if (!window.confirm('¿Eliminar este registro? Esta acción no se puede deshacer.')) return;
            const linkedAppointment = page === 'services'
                ? data.appointments.find((appointment) => appointment.service === record.name && appointment.status === 'Agendada')
                : page === 'barbers'
                    ? data.appointments.find((appointment) => appointment.barber === record.name && appointment.status === 'Agendada')
                    : null;
            if (linkedAppointment) {
                window.alert('No se puede eliminar: hay una cita agendada que depende de este registro.');
                return;
            }
            if (page === 'appointments' && data.payments.some((payment) => payment.appointment === id)) {
                window.alert('No se puede eliminar: existe un pago asociado a esta cita. Cancélala para conservar el historial.');
                return;
            }
            if (page === 'clients') {
                data.appointments.forEach((appointment) => {
                    if (appointment.client === record.name) appointment.client = 'Cliente eliminado';
                });
            }
            data[page] = data[page].filter((item) => item.id !== id);
            saveData();
            renderModule(page);
        } else if (action === 'cancel') {
            if (record.status === 'Cancelada') {
                window.alert('Esta cita ya está cancelada.');
                return;
            }
            record.status = 'Cancelada';
            saveData();
            renderModule(page);
        } else if (action === 'edit') {
            form.reset();
            form.elements.recordId.value = id;
            module.fields.forEach((field) => {
                form.elements[field.key].value = record[field.key] || '';
            });
            form.querySelector('[data-form-title]').textContent = `Modificar ${module.title.split(' (')[0].toLowerCase()}`;
            dialog.showModal();
        } else if (action === 'details') {
            const details = module.columns.map((column) => {
                const value = record[column.key];
                return `${column.label}: ${column.format ? column.format(value, data).replace(/<[^>]*>/g, '') : value}`;
            }).join('\n');
            if (page === 'clients') {
                const history = data.appointments.filter((appointment) => appointment.client === record.name);
                window.alert(`${details}\n\nHistorial de citas: ${history.length}\n${history.map(appointmentLabel).join('\n') || 'Sin citas registradas.'}`);
            } else {
                window.alert(details);
            }
        }
    }

    function generateReminders() {
        const upcoming = data.appointments.filter((appointment) => {
            const date = new Date(appointment.date).getTime();
            return appointment.status === 'Agendada' && date >= now.getTime() && date <= futureDate.getTime();
        });
        let created = 0;
        upcoming.forEach((appointment) => {
            const title = `Recordatorio de cita: ${appointment.client} · ${formatDate(appointment.date)}`;
            if (data.notifications.some((notification) => notification.title === title)) return;
            data.notifications.push({
                id: createId(),
                title,
                message: `Tienes una cita de ${appointment.service} con ${appointment.barber} el ${formatDate(appointment.date)}.`,
                audience: 'Clientes',
                status: 'Preparada'
            });
            created += 1;
        });
        saveData();
        window.alert(`Se generaron ${created} recordatorio(s) en este prototipo. No se enviaron por correo ni SMS.`);
    }

    function downloadCsv(page, module) {
        if (page === 'payments') {
            const reportRows = [
                ['Sección', 'Elemento', 'Fecha / detalle', 'Cantidad / monto', 'Estado'],
                ...data.appointments.map((appointment) => [
                    'Cita', appointment.client,
                    `${formatDate(appointment.date)} · ${appointment.service} · ${appointment.barber}`,
                    '', appointment.status
                ]),
                ...data.payments.map((payment) => [
                    'Pago', appointmentLabel(data.appointments.find((item) => item.id === payment.appointment)),
                    '', formatPrice(payment.amount), payment.status
                ]),
                ...data.barbers.map((barber) => [
                    'Desempeño', barber.name, 'Citas completadas',
                    String(data.appointments.filter((item) => item.barber === barber.name && item.status === 'Completada').length),
                    barber.status
                ])
            ];
            downloadRows(reportRows, 'reporte-nexcode.csv');
            return;
        }
        const rows = [
            module.columns.map((column) => column.label),
            ...data[page].map((record) => module.columns.map((column) => {
                const value = column.format ? column.format(record[column.key], data).replace(/<[^>]*>/g, '') : record[column.key];
                return String(value ?? '');
            }))
        ];
        downloadRows(rows, `${page}-nexcode.csv`);
    }

    function downloadRows(rows, filename) {
        const csv = `\uFEFF${rows.map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(';')).join('\r\n')}`;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    const requestedPage = new URLSearchParams(window.location.search).get('page') || window.location.hash.slice(1);
    const page = requestedPage || document.body.dataset.appPage || 'home';
    document.querySelectorAll('.usuarios form').forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            window.alert('La autenticación requiere un servidor seguro. Este prototipo no envía ni guarda contraseñas.');
        });
    });
    if (modules[page]) renderModule(page, modules[page]);
    else if (page === 'home') renderHomeLinks();
    else {
        const main = document.querySelector('main');
        if (main) main.innerHTML = '<p class="alert alert-warning">El módulo solicitado no existe. <a href="index.html">Volver al inicio</a></p>';
    }
})();

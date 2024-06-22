// Copyright (c) 2023, SanU and contributors
// For license information, please see license.txt

frappe.ui.form.on("Faculty Member", {
    // Start of refresh event
    refresh(frm) {
        // FN: refresh fetched field 'employment_type'
        frappe.db.get_value("Employee", frm.doc.employee, "employment_type", function (value) {
            if (value && value.employment_type) {
                frm.doc.employment_type = value.employment_type;
            }
            frm.refresh_field('employment_type');
        });
        // End of the function

        // Calling function to refresh granting_tenure_data_section 
        fetch_linked_value_and_toggle_section(frm);

    },
    // End of refresh event

    // Start of validate event
    validate: function (frm) {
        // Calling functions
        frm.events.validate_extension(frm);
        frm.events.validate_child_extension(frm, 'faculty_member_academic_ranking', 'attachment', "Attachment File");
        frm.events.validate_child_extension(frm, 'faculty_member_training_course', 'certification', "Certification File");
        
    },
    // End of validate event

    // FN: validate 'decision_attachment' extensions
    validate_extension: function (frm) {
        var decision_attachment = frm.doc.decision_attachment;
        if (decision_attachment) {
            var allowed_extensions = ['.pdf', '.png', '.jpg', '.jpeg'];
            var decision_attachment_extension = decision_attachment.split('.').pop().toLowerCase();
            if (!allowed_extensions.includes('.' + decision_attachment_extension)) {
                frappe.throw("Decision Attachment File has an invalid extension. Only files with extensions " + allowed_extensions.join(', ') + " are allowed.");
                frappe.validated = false;
            }
        }
    },
    // End of the function

    // FN: validate file extensions of child tables
    validate_child_extension: function (frm, child_table_name, attachment_field_name, error_message) {
        if (frm.doc[child_table_name]) {
            frm.doc[child_table_name].forEach(function (row) {
                if (row[attachment_field_name]) {
                    var allowed_extensions = ['.pdf', '.png', '.jpg', '.jpeg'];
                    var attachment_extension = row[attachment_field_name].split('.').pop().toLowerCase();
                    if (!allowed_extensions.includes('.' + attachment_extension)) {
                        frappe.throw(error_message + ' ' + row[attachment_field_name] + " has an invalid extension. Only files with extensions " + allowed_extensions.join(', ') + " are allowed.");
                        frappe.validated = false;
                    }
                }
            });
        }
    },
    // End of the function

    // FN: refresh granting_tenure_data_section immediately 
    employee: function (frm) {
        fetch_linked_value_and_toggle_section(frm);
    }
    // End of the function

});
// End of standard form scripts


// FN: show or hide granting_tenure_data_section 
function fetch_linked_value_and_toggle_section(frm) {
    if (frm.doc.employee) {
        frappe.call({
            method: 'frappe.client.get',
            args: {
                doctype: 'Employee',
                name: frm.doc.employee
            },
            callback: function (r) {
                if (r.message && r.message.employment_type === 'Official') {
                    frm.toggle_display('granting_tenure_data_section', true);
                } else {
                    frm.toggle_display('granting_tenure_data_section', false);
                }
            }
        });
    } else {
        frm.toggle_display('granting_tenure_data_section', false);
    }
}
// End of the function



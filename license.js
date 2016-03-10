
function create(doc) {
	var xml = "<app><license id=\"" + doc.lic_id +
		"\" expiration=\"" + doc.exp_date +
		"\" type=\"" + doc.lic_type +
		"\" customer=\"" + doc.name +
		"\" email=\"" + doc.email +
		"\" app=\"" + doc.product +
		"\" version=\"" + doc.version +
		"\" edition=\"" + doc.edition +
		"\">" +
		"<name>" + doc.name + "</name>" +
		"</license></app>";
	        
	console.log(xml);

	return xml;
}

exports.create = create;
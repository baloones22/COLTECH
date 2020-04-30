import { object, date, number, string } from 'yup';
import { addMonths, parseISO, isBefore, endOfDay } from 'date-fns';
import Report from '../models/Report';
import SolicitationReports from '../models/SolicitationReports';
import Document from '../models/Document';
import ShopKeeper from '../models/ShopKeeper';
import File from '../models/File';

class SolicitationController {
  
  async store(req, res) {
    const schema = object().shape({     
      document_id: number(),
      description: string(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }
    const {document_id,description} = req.body;
    console.log('backend requisição', {
      document_id,
      description,
    });
    
    
    const document = await Document.findByPk(document_id);
    console.log('ID DOCUMENT -> ', document_id);
    if (!document) {
      return res.status(400).json({ error: 'Document not found' });
    }; 
    const reportExist = await SolicitationReports.findOne({
      where: { description: req.body.description },
    });
    if (reportExist) {
      return res.status(401).json({ error: 'Request already exist'});
    }
    const { id } = await SolicitationReports.create(req.body);       
    return res.json({
      id,
    });
  }

  async index(req, res) {
    const reports = await SolicitationReports.findAll();
        return res.json(reports);
  }

  async showbydoc(req, res){
    const document_id =req.params.document_id;
    const requests=await SolicitationReports.findAll({
      where:{document_id:document_id}
    });
    if (!requests) return res.status(404).json({ error: "Request not found."});
    return res.json(requests);  
  }

 async show(req, res) {
    const { id } = req.params;

    const request = await SolicitationReports.findByPk(id);
    if (!request) {
      return res.status(401).json({ error: 'request does not exist' });
    }
    return res.json(reports);
  }
}
export default new SolicitationController();
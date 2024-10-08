import Children from '../models/childrenModel.js'; // Importez le modèle Children
import Absent from '../models/absentModel.js'; // Importez le modèle Absent

const AbsentChild = async (req, res) => {
  try {
    const requestBody = req.body.ids;
    console.log("body", requestBody);
console.log("ab",requestBody);

    // Retrieve all children from the database with the required fields
    const allChildren = await Children.find();

    // Compare the existing children with the children in the request
    const absentChildren = allChildren.filter(child => {
      // Check if the child in the database is not in the request body
      return !requestBody.includes(child._id.toString());
    });
    console.log('Absent', absentChildren);

    // Create an object to store absent counts and dates for each child
    const absentInfo = {};

    // Loop through the absent children and update or save them in the Absent model
    for (const child of absentChildren) {
      // Check if the child exists in the Absent model
      const existingChild = await Absent.findOne({ childId: child._id });

      if (existingChild) {
        // The child already exists in the Absent model, update its information
        existingChild.absentCount += 1;
        // Save the current absent count
        absentInfo[child._id] = {
          absentCount: existingChild.absentCount,
          absentDates: existingChild.absentDates || [],
        };
        // Push the current date to the absent dates array
        absentInfo[child._id].absentDates.push(existingChild.lastAbsentDate);

        await existingChild.save();
      } else {
        // The child does not exist in the Absent model, save it
        const newAbsentChild = new Absent({
          childId: child._id,
          firstName: child.firstName, // Include the firstName field
          class: child.class,
          phoneNumber: child.phoneNumber,
          absentCount: 1,
          lastAbsentDate: new Date(),
          absentDates: [new Date()] // Initialize absent dates array
        });

        // Save the current absent count and date
        absentInfo[child._id] = {
          absentCount: newAbsentChild.absentCount,
          absentDates: newAbsentChild.absentDates,
        };

        await newAbsentChild.save();
      }
    }

    res.status(200).json({ message: 'Child attendance updated successfully.', absentInfo });
  } catch (error) {
    console.error('Error comparing children:', error);
    res.status(500).json({ error: 'An error occurred while comparing children.' });
  }
};



const absentChildren = async (req, res) => {
  try {
    const getAbsent = await Absent.find();
    return res.status(200).json(getAbsent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while fetching absent children" });
  }
}

// delete absent count and date

const deleteAbsentCountAndDates = async (req, res) => {
  try {
    const { id } = req.params; // Récupère l'id depuis les paramètres
    console.log("####", id);

    // Trouver l'enregistrement d'absence
    const absentRecord = await Absent.findById(id);

    if (!absentRecord) {
      return res.status(404).json({ message: "Enregistrement d'absence non trouvé" });
    }

    if (absentRecord.absentCount === 1) {
      // Supprimer l'enregistrement d'absence s'il n'y a plus d'absences
      await Absent.findByIdAndDelete(id);
      return res.status(200).json({ message: "Enfant supprimé de la liste d'absences" });
    } else {
      // Sinon, réduire le compteur et supprimer les dates d'absence
      await Absent.findByIdAndUpdate(
        id,
        {
          $inc: { absentCount: -1 }, // Réduit absentCount de 1
          $unset: { absentDates: "" } // Supprime absentDates
        },
        { new: true }
      );

      res.status(200).json({ message: "AbsentCount réduit et dates d'absence supprimées" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};



export default { AbsentChild,absentChildren,deleteAbsentCountAndDates };

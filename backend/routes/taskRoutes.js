const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

router.get('/tasks', async (req, res) => {
  try {
    const { after } = req.query;
    const afterDate = after ? new Date(after) : new Date(0);

    const tasks = await Task.find({ createdAt: { $gt: afterDate } })
      .sort({ createdAt: 1 })
      .limit(20);

    // Map _id to id for frontend compatibility
    const formattedTasks = tasks.map(task => ({
      id: task._id.toString(),
      title: task.title,
      status: task.status,
      createdAt: task.createdAt,
    }));

    res.json(formattedTasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// POST /api/simulate
let isSimulating = false;

router.post('/simulate', async (req, res) => {
  if (isSimulating) {
    return res.status(409).json({ message: 'Simulation déjà en cours' });
  }

  try {
    isSimulating = true;

    const statuses = ['todo', 'in_progress', 'done'];
    const countExisting = await Task.countDocuments();

    let count = 0;
    const interval = setInterval(async () => {
      if (count >= 10) {
        clearInterval(interval);
        isSimulating = false;  // on libère le flag à la fin
        return;
      }

      const newTask = new Task({
        title: `Tâche ${countExisting + count + 1}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });

      await newTask.save();
      console.log(`Tâche ${countExisting + count + 1} créée`);
      count++;
    }, 5000);

    res.status(202).json({ message: 'Simulation lancée : 10 tâches vont être créées.' });

  } catch (err) {
    isSimulating = false;  // on libère le flag en cas d'erreur aussi
    console.error('Erreur dans POST /simulate:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

  
  

module.exports = router;

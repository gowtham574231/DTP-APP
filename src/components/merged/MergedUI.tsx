import React from "react";
import { Droppable, Draggable, DragDropContext } from "@hello-pangea/dnd";
import styles from "./Merged.module.css";

interface Section {
  title?: string;
  paragraphs?: string;
}


interface MergedUIProps {
  sections: Section[];
  onDelete: (index: number) => void;
  onDragEnd: (result: any) => void;
  onGenerate: () => void;
  onClear: () => void;
}

const MergedUI: React.FC<MergedUIProps> = ({
  sections,
  onDelete,
  onDragEnd,
  onGenerate,
  onClear,
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Merged Sections</h2>

      {sections.length === 0 ? (
        <p className={styles.emptyText}>No sections merged yet.</p>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <ul
                className={styles.sectionList}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {sections.map((s, i) => (
                  <Draggable
                    key={i.toString()}
                    draggableId={i.toString()}
                    index={i}
                  >
                    {(providedDrag) => (
                      <li
                        ref={providedDrag.innerRef}
                        {...providedDrag.draggableProps}
                        {...providedDrag.dragHandleProps}
                        className={styles.sectionCard}
                      >
                        <div className={styles.sectionInfo}>
                        <strong>{s.title?.toUpperCase()}</strong>
                        </div>

                        <button
                          onClick={() => onDelete(i)}
                          className={styles.deleteBtn}
                        >
                          ✕
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <div className={styles.buttonRow}>
        <button onClick={onGenerate} className={styles.generateBtn}>
          Generate Merged Word File
        </button>

        <button onClick={onClear} className={styles.clearBtn}>
          Clear All
        </button>
      </div>
    </div>
  );
};

export default MergedUI;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    public class Word
    {
        private string name;
        private int idOfWord;
        private int dfOfWord;

        #region Getter&Setter
        public string Name 
        {
            get
            {
                return this.name;
            }
            private set
            {
                this.name = value;
            }
        }
        public int IdOfWrod 
        { 
            get
            {
                return this.idOfWord;
            }
            private set
            {
                this.idOfWord = value;
            }
        }
        public int DfOfWrod 
        {
            get
            {
                return this.dfOfWord;
            }
            private set
            {
                this.dfOfWord = value;
            }
        }
        public string VocabularyId { get; private set; }
        public virtual Vocabulary Vocabulary { get; private set; }
        #endregion

        private Word() { }
    }
}
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using System.Reflection;
using System.Xml;
using System.Xml.Serialization;

namespace SerializerTools
{
    public class XmlCustomSerializer_old1
    {
        #region Common methods
     
        private static bool TestAttribute(object[] attributes)
        {
            foreach (object obj in attributes)
            {
                if (obj is XmlIgnoreAttribute)
                    return false;
            }

            return true;
        }

        #endregion


        #region Methods for serialization

        public static String Serialize(Object objToSerialize)
        {
            XmlWriter writer = null;
            StringBuilder serializeData = new StringBuilder();
            XmlWriterSettings set = new XmlWriterSettings();
            set.Indent = true;
            set.OmitXmlDeclaration = true;
            set.Encoding = Encoding.UTF8;
            set.NewLineChars = "\r\n";

            try
            {
                writer = XmlWriter.Create(serializeData, set);
                //_writer = XmlWriter.Create(serializeData);
                writer.WriteStartDocument();

                //SerializeObject(objToSerialize);
                SerializeObject(writer, objToSerialize);
                //SerializeObject(objToSerialize, null, _allFields);

                writer.WriteEndDocument();
            }
            finally
            {
                if (writer != null)
                writer.Close();
            }

            return serializeData.ToString();
        }

        private static void SerializeObject(XmlWriter writer, object objToSerialize)
        {
            string objName = objToSerialize.GetType().FullName;

            if (objToSerialize is IConvertible)
            {
                writer.WriteElementString(objName, ConvertToString(objToSerialize));
            }
            else if (objToSerialize is IDictionary)
            {
                SerializeDictionary(writer, null, (IDictionary)objToSerialize);
            }
            else if (objToSerialize is IList)
            {
                SerializeList(writer, null, (IList)objToSerialize);
            }
            else
            {
                SerializeObject(writer, objToSerialize, null);
            }
        }

        private static void SerializeObject(XmlWriter writer, object objToSerialize, String Name)
        {
            Type objectType = objToSerialize.GetType();

            //on met le nom du type pour le root et le nom du field pour les autre
            String keyName = Name ?? objectType.FullName;

            writer.WriteStartElement(keyName);

            PropertyInfo[] allfieldsTmp = objectType.GetProperties();
            foreach (PropertyInfo fieldTmp in allfieldsTmp)
            {
                object[] attributes = fieldTmp.GetCustomAttributes(true);
                // test if attribute XmlIgnoreAttribute is set and if the propertty is the same type the object to serialize ex: singleton (cause stack overflow)
                if (TestAttribute(attributes) && objToSerialize.GetType().FullName != fieldTmp.PropertyType.FullName)
                {
                    object val = fieldTmp.GetValue(objToSerialize, null);
                    if (val != null)
                    {
                        if (val is IConvertible)
                            writer.WriteElementString(fieldTmp.Name, ConvertToString(val));
                        else if (val is IDictionary)
                        {
                            SerializeDictionary(writer, fieldTmp.Name, (IDictionary)val);
                        }
                        else if (val is IList)
                        {
                            SerializeList(writer, fieldTmp.Name, (IList)val);
                        }
                        else
                            SerializeObject(writer, val, fieldTmp.Name);
                    }
                }
            }
            writer.WriteEndElement();
        }

        private static void SerializeList(XmlWriter writer, string name, IList listToSerialize)
        {
            string nameTmp = name ?? "List";
            writer.WriteStartElement(nameTmp);
            foreach (object listItem in listToSerialize)
            {
                SerializeObject(writer, listItem);
            }

            writer.WriteEndElement();
        }

        private static void SerializeDictionary(XmlWriter writer, string name, IDictionary dicoToSerialize)
        {
            string nameTmp = name ?? "Dictionary";
            writer.WriteStartElement(nameTmp);

            foreach (DictionaryEntry entry in dicoToSerialize)
            {
                writer.WriteStartElement("Key");
                SerializeObject(writer, entry.Key);
                writer.WriteEndElement();

                writer.WriteStartElement("Value");
                SerializeObject(writer, entry.Value);
                writer.WriteEndElement();
            }

            writer.WriteEndElement();
        }

        private static String ConvertToString(object obj)
        {
            //return "test";
            String strResu;
            if (obj is IConvertible)
            {
                
                IConvertible convertible = obj as IConvertible;
                switch (convertible.GetTypeCode())
                //switch (Type.GetTypeCode(obj.GetType()))
                {
                    case TypeCode.DateTime:
                        strResu = Convert.ToString(convertible, CultureInfo.InvariantCulture);

                        //DateTime dateTmp = (DateTime)obj;
                        //strResu = String.Format("{0} {1}", dateTmp.ToLongDateString(), dateTmp.ToLongTimeString());
                        //strResu = String.Format("{0:D2}/{1:D2}/{2:D2} {3:D2}:{4:D2}:{5:D2}", dateTmp.Month, dateTmp.Day, dateTmp.Year, dateTmp.Hour, dateTmp.Minute, dateTmp.Second);
                        //strResu = "";
                        break;
                    //case TypeCode.String:
                    //case TypeCode.Boolean:
                    //    strResu = obj.ToString();
                    //    break; 
                    //case TypeCode.Char:
                    //case TypeCode.SByte:
                    //case TypeCode.Int16:
                    //case TypeCode.UInt16:
                    //case TypeCode.Int32:
                    //case TypeCode.Byte:
                    //case TypeCode.UInt32:
                    //case TypeCode.Int64:
                    //case TypeCode.UInt64:
                    //case TypeCode.Single:
                    //case TypeCode.Double:
                    //case TypeCode.Decimal:
                    //    strResu = convertible.ToString();
                    //    break;
                    default:
                        strResu = obj.ToString();
                        //strResu = convertible.ToString(); //obj.ToString(); //
                        break;
                }


                //IConvertible objConv = obj as IConvertible;
                //strResu = Convert.ToString(objConv, CultureInfo.InvariantCulture);
            }
            else
                throw new Exception("Unsuported Type");

            return strResu;
        }

        #endregion
        

        #region Methods for deserialization

        public static T Deserialize<T>(String serializedObject/*, Type objType*/)
        {
            XmlReaderSettings setting = new XmlReaderSettings();
            setting.IgnoreComments = true;
            setting.IgnoreProcessingInstructions = true;
            setting.IgnoreWhitespace = true;

            object objResu;
            XmlReader myReader = null;
            try
            {
                myReader = XmlReader.Create(new StringReader(serializedObject), setting);
                objResu = GetObject(myReader, typeof(T), typeof(T).FullName);
            }
            finally
            {
                if (myReader != null)
                    myReader.Close();
            }

            return (T)objResu;
        }

        private static object GetObject(XmlReader reader, Type objectType)
        {
            object newObject = Activator.CreateInstance(objectType);
            PropertyInfo[] allfieldsTmp = objectType.GetProperties();
            object val = null;

            while (reader.Read())
            {
                switch (reader.NodeType)
                {
                    case XmlNodeType.Element:
                        if (reader.Name != objectType.FullName)
                        {
                            String xmlFieldName = reader.Name;
                            PropertyInfo currentProperty = SearchProperty(allfieldsTmp, xmlFieldName);
                            if (currentProperty != null)
                            {
                                object[] attributes = currentProperty.GetCustomAttributes(true);
                                if (currentProperty != null && TestAttribute(attributes))
                                {
                                    if (typeof(IDictionary).IsAssignableFrom(currentProperty.PropertyType))
                                    {
                                        val = CreateDictionary(reader, currentProperty.PropertyType, currentProperty.Name);
                                    }
                                    else if (typeof(IList).IsAssignableFrom(currentProperty.PropertyType))
                                    {
                                        val = CreateList(reader, currentProperty.PropertyType, currentProperty.Name);
                                    }
                                    else if (typeof(Enum).IsAssignableFrom(currentProperty.PropertyType))
                                    {
                                        val = CreateEnum(reader, currentProperty.PropertyType);
                                    }
                                    else if (typeof(IConvertible).IsAssignableFrom(currentProperty.PropertyType))
                                    {
                                        val = CreateValue(reader, currentProperty.PropertyType);
                                    }
                                    else
                                    {
                                        val = GetObject(reader, currentProperty.PropertyType, xmlFieldName);
                                    }
                                    objectType.InvokeMember(xmlFieldName, BindingFlags.SetProperty, null, newObject, new Object[] { val });
                                }
                            }
                        }
                        break;
                    case XmlNodeType.EndElement:
                        if (reader.Name == objectType.FullName)
                        {
                            return newObject;
                        }
                        break;
                }
            }

            return newObject;
        }

        private static object GetObject(XmlReader reader, Type objType, string objName)
        {
            // we test which type of object it is
            if (typeof(IConvertible).IsAssignableFrom(objType))
            {
                return CreateValue(reader, objType);
            }

            //object newObj = Activator.CreateInstance(objType);

            if (typeof(IDictionary).IsAssignableFrom(objType))
            {
                return CreateDictionary(reader, objType, objName);
            }
            else if (typeof(IList).IsAssignableFrom(objType))
            {
                return CreateList(reader, objType, objName);
            }
            else
            {
                return GetObject(reader, objType);
            }
        }

        private static IDictionary CreateDictionary(XmlReader reader, Type objectType, string dicoName)
        {
            bool run = true;
            IDictionary newDico = (IDictionary)Activator.CreateInstance(objectType);
            Type[] typeLst = newDico.GetType().GetGenericArguments();
            object currentObj = null, key = null;

            String /*key = null,*/ val = "";
            while (run && reader.Read())
            {
                switch (reader.NodeType)
                {
                    case XmlNodeType.Element:
                        if (reader.Name != dicoName && reader.Name != "Key" && reader.Name != "Value")
                        {
                            if (key == null) // first pass, we retrieve the dictionary key
                            {
                                //key = reader.Name;
                                if (typeLst != null && typeLst.Length == 2)
                                {
                                    key = GetObject(reader, typeLst[0], null);
                                }
                            }
                            else // second pass, key is not null, it's the dictionary value
                            {
                                
                                if (typeLst != null && typeLst.Length == 2)
                                {
                                    currentObj = GetObject(reader, typeLst[1], reader.Name);
                                }
                            }
                        }

                        break;
                    case XmlNodeType.Text:
                        val = reader.Value;
                        break;
                    case XmlNodeType.EndElement:
                        if (reader.Name == dicoName)
                        {
                            run = false;
                        }
                        else if (reader.Name == "Value")
                        {
                            if (typeLst != null && typeLst.Length == 2)
                            {
                                //newList.Add(ConvertFromString(key, typeLst[0]), ConvertFromString(val, typeLst[1]));
                                //object pp = ConvertFromString(val, typeLst[1]);
                                //newList.Add(key, pp);
                                if (currentObj == null)
                                    newDico.Add(key, ConvertFromString(val, typeLst[1]));
                                else
                                    newDico.Add(key, currentObj);

                                key = null;
                            }
                            else
                                newDico.Add(key, val);
                        }
                        break;
                }

            }

            return newDico;
        }

        private static IList CreateList(XmlReader reader, Type objectType, string ObjectName)
        {
            IList newList = (IList)Activator.CreateInstance(objectType);
            Type[] typeLst = newList.GetType().GetGenericArguments();

            if (reader.IsEmptyElement)
                return newList;

            String key = "";
            while (reader.Read())
            {
                switch (reader.NodeType)
                {
                    case XmlNodeType.Element:
                        if (reader.Name != ObjectName)
                        {
                            key = reader.Name;
                            Type typeElement;
                            if (typeLst.Length == 1)
                                typeElement = typeLst[0];
                            else
                                typeElement = Type.GetType(key);

                            newList.Add(GetObject(reader, typeElement, typeElement.FullName));
                        }
                        break;
                    case XmlNodeType.EndElement:
                        if (reader.Name == ObjectName)
                            return newList;
                        break;
                }

            }

            return newList;
        }

        private static object CreateEnum(XmlReader reader, Type objectType)
        {
            object val = null;
            while (reader.Read())
            {
                if (reader.NodeType == XmlNodeType.Text)
                {
                    val = Enum.Parse(objectType, reader.Value);
                    //val = ConvertFromString(reader.Value, objectType);
                }
                else if (reader.NodeType == XmlNodeType.EndElement)
                {
                    break;
                }
            }

            return val;
        }

        
        private static object CreateValue(XmlReader reader, Type objectType)
        {
            object val = null;
            while (reader.Read())
            {
                if (reader.NodeType == XmlNodeType.Text)
                {
                    val = ConvertFromString(reader.Value, objectType);
                }
                else if (reader.NodeType == XmlNodeType.EndElement)
                {
                    break;
                }
            }

            return val;
        }

        private static object ConvertFromString(String val, Type objType)
        {
            object objTmp;
            
            switch (Type.GetTypeCode(objType))
            {
                case TypeCode.DateTime:
                    objTmp = Convert.ToDateTime(val, CultureInfo.InvariantCulture);
                    break;
                case TypeCode.Char:
                    objTmp = Char.Parse(val);
                    break;
                case TypeCode.Boolean:
                    //objTmp = Convert.ToBoolean(val);
                    objTmp = bool.Parse(val);
                    break;
                case TypeCode.SByte:
                    objTmp = SByte.Parse(val);
                    break;
                case TypeCode.Int16:
                    objTmp = Int16.Parse(val);
                    break;
                case TypeCode.UInt16:
                    objTmp = UInt16.Parse(val);
                    break;
                case TypeCode.Int32:
                    objTmp = Int32.Parse(val); //Convert.ToInt32(val);
                    break;
                case TypeCode.Byte:
                    objTmp = Byte.Parse(val);
                    break;
                case TypeCode.UInt32:
                    objTmp = UInt32.Parse(val);
                    break;
                case TypeCode.Int64:
                    objTmp = Int64.Parse(val); //Convert.ToInt64(val);
                    break;
                case TypeCode.UInt64:
                    objTmp = UInt64.Parse(val);
                    break;
                case TypeCode.Single:
                    objTmp = Single.Parse(val);
                    break;
                case TypeCode.Double:
                    objTmp = Double.Parse(val);
                    break;
                case TypeCode.Decimal:
                    objTmp = Decimal.Parse(val);
                    break;
                case TypeCode.String:
                case TypeCode.Object:
                    objTmp = val;
                    break;
                default:
                    objTmp = val;
                    break;
            }

            //TypeConverter keyConverter = TypeDescriptor.GetConverter(objType);

            ////il n'arive pas a convertir un objet simple en object donc on test
            //objTmp = objType == typeof(Object)
            //                    ? val
            //                    : keyConverter.ConvertFromInvariantString(val);

            //TypeConverter converter = TypeDescriptor.GetConverter(val.GetType());
            //object objTmp = converter.ConvertFromInvariantString(val);

            return objTmp;
        }

        private static PropertyInfo SearchProperty(PropertyInfo[] allfields, string name)
        {
            foreach (PropertyInfo propertyTmp in allfields)
            {
                if (propertyTmp.Name == name)
                    return propertyTmp;
            }

            return null;
        }

        #endregion
    }
}


